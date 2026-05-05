import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getRequiredSession } from "@/lib/api-auth";

/**
 * GET /api/cash-flow/credit-card
 * Fetches the credit card for the given id_user_wallet.
 */
export async function GET(request: Request) {
  const { response } = await getRequiredSession();
  if (response) return response;

  const { searchParams } = new URL(request.url);
  const id_user_wallet = searchParams.get("id_user_wallet");

  if (!id_user_wallet) {
    return NextResponse.json({ error: "id_user_wallet is required" }, { status: 400 });
  }

  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("tbl_credit_cards")
    .select("*")
    .eq("id_user_wallet", id_user_wallet)
    .order("dt_created", { ascending: true });

  if (fetchError) {
    return NextResponse.json(
      { error: `Failed to fetch credit cards: ${fetchError.message}` },
      { status: 500 }
    );
  }

  if (existing && existing.length > 0) {
    return NextResponse.json(existing);
  }

  // No credit card found — create one with default values
  const { data: created, error: insertError } = await supabaseAdmin
    .from("tbl_credit_cards")
    .insert({
      id_user_wallet,
      ds_description: "Meu Cartão",
      vl_balance: 0,
      vl_day: 1,
      dt_day_closing: 1
    })
    .select()
    .single();

  return NextResponse.json([created], { status: 201 });
}

/**
 * PATCH /api/cash-flow/credit-card
 * Updates a credit card record.
 */
export async function PATCH(request: Request) {
  const { response } = await getRequiredSession();
  if (response) return response;

  const body = await request.json() as {
    id_credit_card: string;
    ds_description: string;
    vl_balance: number;
    vl_day: number;
    dt_day_closing: number;
  };

  const { id_credit_card, ds_description, vl_balance, vl_day, dt_day_closing } = body;

  if (!id_credit_card) {
    return NextResponse.json({ error: "id_credit_card is required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("tbl_credit_cards")
    .update({
      ds_description,
      vl_balance,
      vl_day,
      dt_day_closing,
      dt_updated: new Date().toISOString(),
    })
    .eq("id_credit_card", id_credit_card)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: `Failed to update credit card: ${error.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
