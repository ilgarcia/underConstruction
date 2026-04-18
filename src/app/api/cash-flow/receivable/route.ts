import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * GET /api/cash-flow/receivable
 * Fetches receivable records by wallet id.
 */
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id_user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id_user_wallet = searchParams.get("wallet_id");

  if (!id_user_wallet) {
    return NextResponse.json(
      { error: "wallet_id query parameter is required" },
      { status: 400 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from("tbl_receivables")
    .select("*")
    .eq("id_user_wallet", id_user_wallet)
    .order("vl_day_receivable", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: `Failed to fetch receivables: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}

/**
 * POST /api/cash-flow/receivable
 * Creates a new receivable record.
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id_user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    id_user_wallet: string;
    ds_receivable: string;
    vl_receivable: number;
    vl_day_receivable: number;
  };

  const { id_user_wallet, ds_receivable, vl_receivable, vl_day_receivable } =
    body;

  if (
    !id_user_wallet ||
    !ds_receivable ||
    vl_receivable === undefined ||
    vl_day_receivable === undefined
  ) {
    return NextResponse.json(
      {
        error:
          "id_user_wallet, ds_receivable, vl_receivable, and vl_day_receivable are required",
      },
      { status: 400 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from("tbl_receivables")
    .insert({
      id_user_wallet,
      ds_receivable,
      vl_receivable,
      vl_day_receivable,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: `Failed to create receivable: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json(data, { status: 201 });
}
