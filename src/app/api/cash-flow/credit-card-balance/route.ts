import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getRequiredSession } from "@/lib/api-auth";

/**
 * GET /api/cash-flow/credit-card-balance
 * Fetches credit card balance records by credit card id.
 */
export async function GET(request: Request) {
  const { response } = await getRequiredSession();
  if (response) return response;

  const { searchParams } = new URL(request.url);
  const id_credit_card = searchParams.get("wallet_id"); // The store factory uses wallet_id in fetchItems

  if (!id_credit_card) {
    return NextResponse.json(
      { error: "wallet_id query parameter is required" },
      { status: 400 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from("tbl_credit_card_balances")
    .select("*")
    .eq("id_credit_card", id_credit_card)
    .order("vl_day", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: `Failed to fetch credit card balance: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}

/**
 * POST /api/cash-flow/credit-card-balance
 * Creates one or more new credit card balance records.
 */
export async function POST(request: Request) {
  const { response } = await getRequiredSession();
  if (response) return response;

  const body = await request.json();
  const isBatch = Array.isArray(body);

  if (isBatch) {
    if (body.length === 0) {
      return NextResponse.json({ error: "Empty batch" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("tbl_credit_card_balances")
      .insert(
        body.map((item: Record<string, unknown>) => ({
          id_credit_card: item.id_user_wallet, // The hook maps id_user_wallet -> id_credit_card in the request payload
          ds_description: item.ds_description,
          vl_amount: item.vl_amount,
          vl_day: item.vl_day,
        })),
      )
      .select();

    if (error) {
      return NextResponse.json(
        { error: `Failed to create balance batch: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } else {
    const { id_user_wallet, ds_description, vl_amount, vl_day } = body;

    if (
      !id_user_wallet ||
      !ds_description ||
      vl_amount === undefined ||
      vl_day === undefined
    ) {
      return NextResponse.json(
        {
          error:
            "id_user_wallet, ds_description, vl_amount, and vl_day are required",
        },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("tbl_credit_card_balances")
      .insert({
        id_credit_card: id_user_wallet,
        ds_description,
        vl_amount,
        vl_day,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: `Failed to create balance: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json(data, { status: 201 });
  }
}

/**
 * DELETE /api/cash-flow/credit-card-balance
 * Hard deletes records by a list of ids.
 */
export async function DELETE(request: Request) {
  const { response } = await getRequiredSession();
  if (response) return response;

  const { ids } = (await request.json()) as { ids: string[] };

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json(
      { error: "A list of ids is required" },
      { status: 400 },
    );
  }

  const { error } = await supabaseAdmin
    .from("tbl_credit_card_balances")
    .delete()
    .in("id_credit_card_balance", ids);

  if (error) {
    return NextResponse.json(
      { error: `Failed to delete records: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}

/**
 * PATCH /api/cash-flow/credit-card-balance
 * Updates an existing record.
 */
export async function PATCH(request: Request) {
  const { response } = await getRequiredSession();
  if (response) return response;

  const body = (await request.json()) as {
    id_credit_card_balance: string;
    ds_description?: string;
    vl_amount?: number;
    vl_day?: number;
  };

  const { id_credit_card_balance, ds_description, vl_amount, vl_day } = body;

  if (!id_credit_card_balance) {
    return NextResponse.json(
      { error: "id_credit_card_balance is required" },
      { status: 400 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from("tbl_credit_card_balances")
    .update({
      ds_description,
      vl_amount,
      vl_day,
      dt_updated: new Date().toISOString(),
    })
    .eq("id_credit_card_balance", id_credit_card_balance)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: `Failed to update record: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}
