import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Whitelist de emails permitidos - temporario até criação e permissões
const allowedUsers = process.env.ALLOWED_USERS?.split(",") || [];

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      if (user.email && allowedUsers.includes(user.email)) {
        return true;
      }
      return false;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
