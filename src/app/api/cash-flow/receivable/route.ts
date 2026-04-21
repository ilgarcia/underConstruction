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
    .order("vl_day", { ascending: true });

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
 * Creates one or more new receivable records.
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
      .from("tbl_receivables")
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
        { error: `Failed to create receivables batch: ${error.message}` },
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
      .from("tbl_receivables")
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
        { error: `Failed to create receivable: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json(data, { status: 201 });
  }
}

/**
 * DELETE /api/cash-flow/receivable
 * Hard deletes receivables by a list of ids.
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
    .from("tbl_receivables")
    .delete()
    .in("id_receivable", ids);

  if (error) {
    return NextResponse.json(
      { error: `Failed to delete receivables: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}

/**
 * PATCH /api/cash-flow/receivable
 * Updates an existing receivable record.
 */
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id_user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    id_receivable: string;
    ds_description?: string;
    vl_amount?: number;
    vl_day?: number;
  };

  const { id_receivable, ds_description, vl_amount, vl_day } = body;

  if (!id_receivable) {
    return NextResponse.json(
      { error: "id_receivable is required" },
      { status: 400 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from("tbl_receivables")
    .update({
      ds_description,
      vl_amount,
      vl_day,
      dt_updated: new Date().toISOString(),
    })
    .eq("id_receivable", id_receivable)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: `Failed to update receivable: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}
