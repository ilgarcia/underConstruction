import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getRequiredSession } from "@/lib/api-auth";
import { toFrequency } from "@/helpers/month";

/**
 * GET /api/cash-flow/extra-expense
 * Fetches extra expense records by wallet id.
 */
export async function GET(request: Request) {
  const { response } = await getRequiredSession();
  if (response) return response;

  const { searchParams } = new URL(request.url);
  const id_user_wallet = searchParams.get("wallet_id");

  if (!id_user_wallet) {
    return NextResponse.json(
      { error: "wallet_id query parameter is required" },
      { status: 400 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from("tbl_extra_expenses")
    .select("*")
    .eq("id_user_wallet", id_user_wallet)
    .order("vl_day", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: `Failed to fetch extra expenses: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}

/**
 * POST /api/cash-flow/extra-expense
 * Creates one or more new extra expense records.
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
      .from("tbl_extra_expenses")
      .insert(
        body.map((item: Record<string, unknown>) => ({
          id_user_wallet: item.id_user_wallet,
          ds_description: item.ds_description,
          vl_amount: item.vl_amount,
          vl_day: item.vl_day,
          ...toFrequency(item),
        })),
      )
      .select();

    if (error) {
      return NextResponse.json(
        { error: `Failed to create extra expenses batch: ${error.message}` },
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
      .from("tbl_extra_expenses")
      .insert({
        id_user_wallet,
        ds_description,
        vl_amount,
        vl_day,
        ...toFrequency(body),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: `Failed to create extra expense: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json(data, { status: 201 });
  }
}

/**
 * DELETE /api/cash-flow/extra-expense
 * Hard deletes extra expenses by a list of ids.
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
    .from("tbl_extra_expenses")
    .delete()
    .in("id_extra_expense", ids);

  if (error) {
    return NextResponse.json(
      { error: `Failed to delete extra expenses: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}

/**
 * PATCH /api/cash-flow/extra-expense
 * Updates an existing extra expense record.
 */
export async function PATCH(request: Request) {
  const { response } = await getRequiredSession();
  if (response) return response;

  const body = (await request.json()) as {
    id_extra_expense: string;
    ds_description?: string;
    vl_amount?: number;
    vl_day?: number;
    dt_start_month?: string;
    nr_months?: number | null;
  };

  const { id_extra_expense, ds_description, vl_amount, vl_day } = body;
  // Only touch the frequency when the request sends it
  const frequency = "nr_months" in body ? toFrequency(body) : {};

  if (!id_extra_expense) {
    return NextResponse.json(
      { error: "id_extra_expense is required" },
      { status: 400 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from("tbl_extra_expenses")
    .update({
      ds_description,
      vl_amount,
      vl_day,
      ...frequency,
      dt_updated: new Date().toISOString(),
    })
    .eq("id_extra_expense", id_extra_expense)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: `Failed to update extra expense: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}
