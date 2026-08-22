import { NextRequest } from "next/server";

const COOKIE = "bee-girl-admin";

export function requireAdmin(request: NextRequest) {
  return request.cookies.get(COOKIE)?.value === "1";
}
