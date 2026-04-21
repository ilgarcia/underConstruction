import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * GET /api/cash-flow/expenses
 * Fetches expenses records by wallet id.
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
    .from("tbl_expenses")
    .select("*")
    .eq("id_user_wallet", id_user_wallet)
    .order("vl_day", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: `Failed to fetch expensess: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}

/**
 * POST /api/cash-flow/expenses
 * Creates one or more new expenses records.
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id_user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const isBatch = Array.isArray(body);

  if (isBatch) {
    if (body.length === 0) {
      return NextResponse.json({ error: "Empty batch" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("tbl_expenses")
      .insert(
        body.map((item: any) => ({
          id_user_wallet: item.id_user_wallet,
          ds_description: item.ds_description,
          vl_amount: item.vl_amount,
          vl_day: item.vl_day,
        })),
      )
      .select();

    if (error) {
      return NextResponse.json(
        { error: `Failed to create expensess batch: ${error.message}` },
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
      .from("tbl_expenses")
      .insert({
        id_user_wallet,
        ds_description,
        vl_amount,
        vl_day,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: `Failed to create expenses: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json(data, { status: 201 });
  }
}

/**
 * DELETE /api/cash-flow/expenses
 * Hard deletes expensess by a list of ids.
 */
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id_user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ids } = (await request.json()) as { ids: string[] };

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json(
      { error: "A list of ids is required" },
      { status: 400 },
    );
  }

  const { error } = await supabaseAdmin
    .from("tbl_expenses")
    .delete()
    .in("id_expense", ids);

  if (error) {
    return NextResponse.json(
      { error: `Failed to delete expensess: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}

/**
 * PATCH /api/cash-flow/expenses
 * Updates an existing expenses record.
 */
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id_user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    id_expense: string;
    ds_description?: string;
    vl_amount?: number;
    vl_day?: number;
  };

  const { id_expense, ds_description, vl_amount, vl_day } = body;

  if (!id_expense) {
    return NextResponse.json(
      { error: "id_expense is required" },
      { status: 400 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from("tbl_expenses")
    .update({
      ds_description,
      vl_amount,
      vl_day,
      dt_updated: new Date().toISOString(),
    })
    .eq("id_expense", id_expense)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: `Failed to update expenses: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}
