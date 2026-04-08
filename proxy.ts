import middleware from "next-auth/middleware";

export function proxy(request: any, event: any) {
  return middleware(request, event);
}

export const config = {
  matcher: ["/cash-flow/:path*"],
};
