import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getRequiredSession } from "@/lib/api-auth";

/**
 * GET /api/cash-flow
 * Fetches the cash-flow for the authenticated user.
 * Creates one with vl_balance = 0 if it doesn't exist.
 */
async function GET() {
  const { session, response } = await getRequiredSession();
  if (response) return response;

  const id_user = session.user.id_user;

  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("tbl_user_wallet")
    .select("*")
    .eq("id_user", id_user)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json(
      { error: `Failed to fetch wallet: ${fetchError.message}` },
      { status: 500 },
    );
  }

  if (existing) {
    return NextResponse.json(existing);
  }

  // No wallet found — create one with zero balance
  const { data: created, error: insertError } = await supabaseAdmin
    .from("tbl_user_wallet")
    .insert({ id_user, vl_balance: 0 })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json(
      { error: `Failed to create wallet: ${insertError.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json(created, { status: 201 });
}

/**
 * PATCH /api/cash-flow
 * Updates the vl_balance of a wallet record by id_user_wallet.
 * Body: { id_user_wallet: string; vl_balance: number }
 */
async function PATCH(request: Request) {
  const { response } = await getRequiredSession();
  if (response) return response;

  const body = await request.json() as {
    id_user_wallet: string;
    vl_balance: number;
  };

  const { id_user_wallet, vl_balance } = body;

  if (!id_user_wallet || vl_balance === undefined) {
    return NextResponse.json(
      { error: "id_user_wallet and vl_balance are required" },
      { status: 400 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from("tbl_user_wallet")
    .update({
      vl_balance,
      dt_updated: new Date().toISOString(),
    })
    .eq("id_user_wallet", id_user_wallet)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: `Failed to update wallet: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}

export { GET, PATCH };
