import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { products as starter } from "@/lib/catalog";
import { requireAdmin } from "@/lib/auth";

const sql = () =>
  process.env.DATABASE_URL
    ? neon(process.env.DATABASE_URL)
    : null;

const publicProduct = (p: any) => ({
  id: Number(p.id),
  name: p.name,
  category: p.category,
  description: p.description || "",
  price: Number(p.price_paise) / 100,
  image: p.image_url || "/products/kurti-1.jpg",
  sizes: Array.isArray(p.sizes) ? p.sizes : [],
  colours: Array.isArray(p.colours) ? p.colours : [],
  stock: Number(p.stock),
  active: Boolean(p.active),
});

export async function GET() {
  return NextResponse.json(starter);
}

export async function POST(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json(
      {
        error: "Admin login required.",
      },
      {
        status: 401,
      }
    );
  }

  const db = sql();

  if (!db) {
    return NextResponse.json(
      {
        error: "DATABASE_URL is not configured.",
      },
      {
        status: 500,
      }
    );
  }

  try {
    const b = await request.json();

    const image = String(b.image || "");

    if (
      !b.name ||
      !b.category ||
      !b.price ||
      !image
    ) {
      return NextResponse.json(
        {
          error:
            "Name, category, price and image are required.",
        },
        {
          status: 400,
        }
      );
    }

    if (image.length > 900000) {
      return NextResponse.json(
        {
          error:
            "Image is too large. Please use a smaller photo.",
        },
        {
          status: 400,
        }
      );
    }

    const r: any[] = await db`
      INSERT INTO products (
        name,
        category,
        description,
        price_paise,
        sizes,
        colours,
        stock,
        image_url,
        active
      )
      VALUES (
        ${String(b.name)},
        ${String(b.category)},
        ${String(b.description || "")},
        ${Math.round(Number(b.price) * 100)},
        ${JSON.stringify(
          Array.isArray(b.sizes) ? b.sizes : []
        )}::jsonb,
        ${JSON.stringify(
          Array.isArray(b.colours) ? b.colours : []
        )}::jsonb,
        ${Math.max(0, Number(b.stock || 0))},
        ${image},
        ${b.active !== false}
      )
      RETURNING *
    `;

    return NextResponse.json(
      publicProduct(r[0]),
      {
        status: 201,
      }
    );
  } catch (e: any) {
    console.error(e);

    return NextResponse.json(
      {
        error:
          e?.message || "Could not add product.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json(
      {
        error: "Admin login required.",
      },
      {
        status: 401,
      }
    );
  }

  const db = sql();

  if (!db) {
    return NextResponse.json(
      {
        error: "DATABASE_URL is not configured.",
      },
      {
        status: 500,
      }
    );
  }

  try {
    const b = await request.json();

    const id = Number(b.id);

    if (!id) {
      return NextResponse.json(
        {
          error: "Product id is required.",
        },
        {
          status: 400,
        }
      );
    }

    const image = String(b.image || "");

    if (image.length > 900000) {
      return NextResponse.json(
        {
          error: "Image is too large.",
        },
        {
          status: 400,
        }
      );
    }

    const r: any[] = await db`
      UPDATE products
      SET
        name=${String(b.name)},
        category=${String(b.category)},
        description=${String(b.description || "")},
        price_paise=${Math.round(Number(b.price) * 100)},
        sizes=${JSON.stringify(
          Array.isArray(b.sizes) ? b.sizes : []
        )}::jsonb,
        colours=${JSON.stringify(
          Array.isArray(b.colours) ? b.colours : []
        )}::jsonb,
        stock=${Math.max(0, Number(b.stock || 0))},
        image_url=${image},
        active=${b.active !== false}
      WHERE id=${id}
      RETURNING *
    `;

    if (!r.length) {
      return NextResponse.json(
        {
          error: "Product not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      publicProduct(r[0])
    );
  } catch (e: any) {
    console.error(e);

    return NextResponse.json(
      {
        error:
          e?.message ||
          "Could not update product.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json(
      {
        error: "Admin login required.",
      },
      {
        status: 401,
      }
    );
  }

  const db = sql();

  if (!db) {
    return NextResponse.json(
      {
        error: "DATABASE_URL is not configured.",
      },
      {
        status: 500,
      }
    );
  }

  const id = Number(
    new URL(request.url).searchParams.get("id")
  );

  if (!id) {
    return NextResponse.json(
      {
        error: "Product id is required.",
      },
      {
        status: 400,
      }
    );
  }

  await db`
    UPDATE products
    SET active = false
    WHERE id = ${id}
  `;

  return NextResponse.json({
    success: true,
  });
}
