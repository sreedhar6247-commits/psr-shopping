import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "PSR Shopping API",
    database: "not connected in starter"
  });
}
