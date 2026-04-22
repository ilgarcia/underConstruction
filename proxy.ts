import middleware, { NextRequestWithAuth } from "next-auth/middleware";
import { NextFetchEvent } from "next/server";

export function proxy(request: NextRequestWithAuth, event: NextFetchEvent) {
  return middleware(request, event);
}

export const config = {
  matcher: ["/cash-flow/:path*"],
};
