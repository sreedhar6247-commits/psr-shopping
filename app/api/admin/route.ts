import { NextRequest, NextResponse } from "next/server";

const COOKIE = "bee-girl-admin";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    loggedIn: request.cookies.get(COOKIE)?.value === "1",
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const password = String(body.password || "");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      {
        success: false,
        error: "ADMIN_PASSWORD is not configured in Vercel.",
      },
      { status: 500 }
    );
  }

  if (password !== adminPassword) {
    return NextResponse.json(
      {
        success: false,
        error: "Wrong admin password.",
      },
      { status: 401 }
    );
  }

  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set(COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set(COOKIE, "", {
    maxAge: 0,
    path: "/",
  });

  return response;
}
