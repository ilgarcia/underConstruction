import middleware from "next-auth/middleware";

export function proxy(request: any, event: any) {
  return middleware(request, event);
}

// As rotas dentro do matcher estarão protegidas automaticamente
export const config = {
  matcher: ["/dashboard/:path*"],
};
