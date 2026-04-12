import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id_user: string;
      ds_role: string;
      email: string;
      name?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id_user: string;
    ds_role: string;
    email: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id_user: string;
    ds_role: string;
  }
}
