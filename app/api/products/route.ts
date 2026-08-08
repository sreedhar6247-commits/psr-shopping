import { sql } from "@/lib/db";

export async function GET() {
  try {
    const products = await sql`
      SELECT
        id,
        name,
        category,
        description,
        price,
        image_url,
        stock,
        active
      FROM products
      WHERE active = true
      ORDER BY id DESC
    `;

    return Response.json(products);
  } catch (error) {
    console.error("Products error:", error);

    return Response.json(
      { error: "Failed to load products" },
      { status: 500 }
    );
  }
}
