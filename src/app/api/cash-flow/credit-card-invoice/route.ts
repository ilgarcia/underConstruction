import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getRequiredSession } from "@/lib/api-auth";

const MONTH_KEY = /^\d{4}-\d{2}-01$/;

/**
 * GET /api/cash-flow/credit-card-invoice
 * Fetches the invoice amounts of every card in a wallet.
 */
export async function GET(request: Request) {
  const { response } = await getRequiredSession();
  if (response) return response;

  const { searchParams } = new URL(request.url);
  const id_user_wallet = searchParams.get("id_user_wallet");

  if (!id_user_wallet) {
    return NextResponse.json({ error: "id_user_wallet is required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("tbl_credit_card_invoices")
    // Empty inner embed: filters by the card's wallet without returning the card
    .select(
      "id_credit_card_invoice, id_credit_card, dt_month, vl_amount, dt_created, dt_updated, "
        + "tbl_credit_cards!inner()",
    )
    .eq("tbl_credit_cards.id_user_wallet", id_user_wallet)
    .order("dt_month", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: `Failed to fetch invoices: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}

/**
 * PUT /api/cash-flow/credit-card-invoice
 * Creates or updates the amount of a card's invoice for a due month.
 * Body: { id_credit_card: string; dt_month: "YYYY-MM-01"; vl_amount: number }
 */
export async function PUT(request: Request) {
  const { response } = await getRequiredSession();
  if (response) return response;

  const { id_credit_card, dt_month, vl_amount } = (await request.json()) as {
    id_credit_card: string;
    dt_month: string;
    vl_amount: number;
  };

  if (!id_credit_card || !MONTH_KEY.test(dt_month ?? "") || typeof vl_amount !== "number") {
    return NextResponse.json(
      { error: "id_credit_card, dt_month (YYYY-MM-01) and vl_amount are required" },
      { status: 400 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from("tbl_credit_card_invoices")
    .upsert({ id_credit_card, dt_month, vl_amount }, { onConflict: "id_credit_card,dt_month" })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: `Failed to save invoice: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}
