import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { requireAdmin } from "@/lib/auth";

const db = () =>
  process.env.DATABASE_URL
    ? neon(process.env.DATABASE_URL)
    : null;

function errorResponse(
  error: string,
  status = 400
) {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  );
}

export async function POST(
  request: Request
) {
  const sql = db();

  if (!sql) {
    return errorResponse(
      "DATABASE_URL is not configured.",
      500
    );
  }

  try {
    const body = await request.json();

    const customer = body?.customer || {};
    const items = Array.isArray(body?.items)
      ? body.items
      : [];

    const total = Math.round(
      Number(body?.total || 0) * 100
    );

    if (!customer.name) {
      return errorResponse(
        "Customer name is required."
      );
    }

    if (!customer.phone) {
      return errorResponse(
        "Customer phone is required."
      );
    }

    if (!customer.address) {
      return errorResponse(
        "Delivery address is required."
      );
    }

    if (!items.length) {
      return errorResponse(
        "Order items are required."
      );
    }

    if (total <= 0) {
      return errorResponse(
        "Invalid order total."
      );
    }

    const rows: any[] = await sql`
      INSERT INTO orders (
        customer_name,
        mobile,
        address,
        city,
        state,
        pincode,
        items,
        total_amount,
        status,
        created_at
      )
      VALUES (
        ${String(customer.name)},
        ${String(customer.phone)},
        ${String(customer.address)},
        ${String(customer.city || "")},
        ${String(customer.state || "")},
        ${String(customer.pincode || "")},
        ${JSON.stringify(items)}::jsonb,
        ${total},
        ${String(body?.status || "Paid / New")},
        NOW()
      )
      RETURNING *
    `;

    return NextResponse.json(
      {
        success: true,
        order: rows[0],
      },
      {
        status: 201,
      }
    );
  } catch (e: any) {
    console.error(e);

    return errorResponse(
      e?.message ||
        "Could not save order.",
      500
    );
  }
}

export async function GET(
  request: NextRequest
) {
  if (!requireAdmin(request)) {
    return errorResponse(
      "Admin login required.",
      401
    );
  }

  const sql = db();

  if (!sql) {
    return errorResponse(
      "DATABASE_URL is not configured.",
      500
    );
  }

  try {
    const rows: any[] = await sql`
      SELECT
        id,
        customer_name,
        mobile,
        address,
        city,
        state,
        pincode,
        items,
        total_amount,
        status,
        created_at
      FROM orders
      ORDER BY id DESC
    `;

    return NextResponse.json(
      rows.map((row) => ({
        id: Number(row.id),
        customerName: row.customer_name,
        mobile: row.mobile,
        address: row.address,
        city: row.city,
        state: row.state,
        pincode: row.pincode,
        items: Array.isArray(row.items)
          ? row.items
          : [],
        total:
          Number(row.total_amount || 0) /
          100,
        status: row.status,
        createdAt: row.created_at,
      }))
    );
  } catch (e: any) {
    console.error(e);

    return errorResponse(
      e?.message ||
        "Could not load orders.",
      500
    );
  }
}

export async function PATCH(
  request: NextRequest
) {
  if (!requireAdmin(request)) {
    return errorResponse(
      "Admin login required.",
      401
    );
  }

  const sql = db();

  if (!sql) {
    return errorResponse(
      "DATABASE_URL is not configured.",
      500
    );
  }

  try {
    const body = await request.json();

    const id = Number(body?.id);
    const status = String(
      body?.status || ""
    );

    if (!id) {
      return errorResponse(
        "Order id is required."
      );
    }

    if (!status) {
      return errorResponse(
        "Order status is required."
      );
    }

    const rows: any[] = await sql`
      UPDATE orders
      SET status = ${status}
      WHERE id = ${id}
      RETURNING *
    `;

    if (!rows.length) {
      return errorResponse(
        "Order not found.",
        404
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (e: any) {
    console.error(e);

    return errorResponse(
      e?.message ||
        "Could not update order.",
      500
    );
  }
}
