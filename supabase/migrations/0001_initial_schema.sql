-- PeachOrganizer · schema inicial (do zero)
-- Rode no SQL Editor do Supabase em um projeto vazio.
-- O app acessa o banco só pelo servidor (service role), então o RLS fica ligado
-- e sem políticas: a chave anon não lê nem grava nada.

create extension if not exists pgcrypto;

-- Atualiza dt_updated em todo UPDATE
create or replace function fn_set_dt_updated()
returns trigger
language plpgsql
as $$
begin
  new.dt_updated = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Acesso
-- ---------------------------------------------------------------------------

-- Lista de e-mails que podem entrar (o login checa ds_invite_status = 'accepted')
create table tbl_allowed_users (
  id_allowed_user uuid primary key default gen_random_uuid(),
  ds_email text not null unique,
  ds_invite_status text not null default 'pending'
    check (ds_invite_status in ('pending', 'accepted', 'revoked')),
  dt_created timestamptz not null default now(),
  dt_updated timestamptz not null default now()
);

create table tbl_users (
  id_user uuid primary key default gen_random_uuid(),
  ds_email text not null unique,
  ds_name text,
  ds_role text not null default 'user' check (ds_role in ('user', 'admin')),
  dt_created timestamptz not null default now(),
  dt_updated timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Carteira (uma por pessoa)
-- ---------------------------------------------------------------------------

create table tbl_user_wallet (
  id_user_wallet uuid primary key default gen_random_uuid(),
  id_user uuid not null unique references tbl_users (id_user) on delete cascade,
  vl_balance numeric(14, 2) not null default 0,
  dt_created timestamptz not null default now(),
  dt_updated timestamptz not null default now()
);

-- Quem mais pode ver ou editar a carteira (usado na etapa 3)
create table tbl_wallet_members (
  id_wallet_member uuid primary key default gen_random_uuid(),
  id_user_wallet uuid not null references tbl_user_wallet (id_user_wallet) on delete cascade,
  id_user uuid not null references tbl_users (id_user) on delete cascade,
  ds_permission text not null default 'view' check (ds_permission in ('view', 'edit')),
  dt_created timestamptz not null default now(),
  dt_updated timestamptz not null default now(),
  unique (id_user_wallet, id_user)
);

-- ---------------------------------------------------------------------------
-- Lançamentos
-- ---------------------------------------------------------------------------

-- Contas fixas: repetem todo mês no dia vl_day
create table tbl_expenses (
  id_expense uuid primary key default gen_random_uuid(),
  id_user_wallet uuid not null references tbl_user_wallet (id_user_wallet) on delete cascade,
  ds_description text not null,
  vl_amount numeric(14, 2) not null check (vl_amount >= 0),
  vl_day smallint not null check (vl_day between 1 and 31),
  dt_created timestamptz not null default now(),
  dt_updated timestamptz not null default now()
);

-- Gastos extras: todo mês (nr_months nulo) ou por nr_months meses a partir de dt_start_month
create table tbl_extra_expenses (
  id_extra_expense uuid primary key default gen_random_uuid(),
  id_user_wallet uuid not null references tbl_user_wallet (id_user_wallet) on delete cascade,
  ds_description text not null,
  vl_amount numeric(14, 2) not null check (vl_amount >= 0),
  vl_day smallint not null check (vl_day between 1 and 31),
  dt_start_month date not null default date_trunc('month', now())::date
    check (extract(day from dt_start_month) = 1),
  nr_months smallint check (nr_months is null or nr_months > 0),
  dt_created timestamptz not null default now(),
  dt_updated timestamptz not null default now()
);

-- Recebíveis: mesma regra de frequência dos gastos extras
create table tbl_receivables (
  id_receivable uuid primary key default gen_random_uuid(),
  id_user_wallet uuid not null references tbl_user_wallet (id_user_wallet) on delete cascade,
  ds_description text not null,
  vl_amount numeric(14, 2) not null check (vl_amount >= 0),
  vl_day smallint not null check (vl_day between 1 and 31),
  dt_start_month date not null default date_trunc('month', now())::date
    check (extract(day from dt_start_month) = 1),
  nr_months smallint check (nr_months is null or nr_months > 0),
  dt_created timestamptz not null default now(),
  dt_updated timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Cartões
-- ---------------------------------------------------------------------------

create table tbl_credit_cards (
  id_credit_card uuid primary key default gen_random_uuid(),
  id_user_wallet uuid not null references tbl_user_wallet (id_user_wallet) on delete cascade,
  ds_description text not null,
  vl_day smallint not null default 1 check (vl_day between 1 and 31),
  dt_day_closing smallint not null default 1 check (dt_day_closing between 1 and 31),
  dt_created timestamptz not null default now(),
  dt_updated timestamptz not null default now()
);

-- Gastos recorrentes do cartão (Spotify, academia...): entram em toda fatura
create table tbl_credit_card_balances (
  id_credit_card_balance uuid primary key default gen_random_uuid(),
  id_credit_card uuid not null references tbl_credit_cards (id_credit_card) on delete cascade,
  ds_description text not null,
  vl_amount numeric(14, 2) not null check (vl_amount >= 0),
  vl_day smallint not null check (vl_day between 1 and 31),
  dt_created timestamptz not null default now(),
  dt_updated timestamptz not null default now()
);

-- Valor lançado em cada fatura, pelo mês de vencimento (sempre dia 1).
-- Total da fatura = vl_amount + recorrentes do cartão.
create table tbl_credit_card_invoices (
  id_credit_card_invoice uuid primary key default gen_random_uuid(),
  id_credit_card uuid not null references tbl_credit_cards (id_credit_card) on delete cascade,
  dt_month date not null check (extract(day from dt_month) = 1),
  vl_amount numeric(14, 2) not null default 0 check (vl_amount >= 0),
  dt_created timestamptz not null default now(),
  dt_updated timestamptz not null default now(),
  unique (id_credit_card, dt_month)
);

-- ---------------------------------------------------------------------------
-- Índices, triggers e RLS
-- ---------------------------------------------------------------------------

create index idx_wallet_members_user on tbl_wallet_members (id_user);
create index idx_expenses_wallet on tbl_expenses (id_user_wallet);
create index idx_extra_expenses_wallet on tbl_extra_expenses (id_user_wallet);
create index idx_receivables_wallet on tbl_receivables (id_user_wallet);
create index idx_credit_cards_wallet on tbl_credit_cards (id_user_wallet);
create index idx_credit_card_balances_card on tbl_credit_card_balances (id_credit_card);

do $$
declare
  t text;
begin
  foreach t in array array[
    'tbl_allowed_users', 'tbl_users', 'tbl_user_wallet', 'tbl_wallet_members',
    'tbl_expenses', 'tbl_extra_expenses', 'tbl_receivables', 'tbl_credit_cards',
    'tbl_credit_card_balances', 'tbl_credit_card_invoices'
  ]
  loop
    execute format(
      'create trigger trg_%1$s_dt_updated before update on %1$I '
      'for each row execute function fn_set_dt_updated()', t
    );
    execute format('alter table %I enable row level security', t);
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- Primeiro acesso: troque seu-email@gmail.com pelo seu e-mail do Google
-- (entra liberado no login e já como admin)
-- ---------------------------------------------------------------------------

insert into tbl_allowed_users (ds_email, ds_invite_status)
values ('seu-email@gmail.com', 'accepted');

insert into tbl_users (ds_email, ds_role)
values ('seu-email@gmail.com', 'admin');
