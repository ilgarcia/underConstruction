import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Whitelist de emails permitidos
const allowedUsers = ["limagarcia.igor@gmail.com", "email2@gmail.com"];

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  // JWT é ideal quando não temos banco de dados pois a sessão do usuário 
  // (incluindo informações básicas como email/nome) fica armazenada 
  // num cookie seguro e criptografado no navegador.
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      // Retornar true permite o login, false bloqueia (Apenas whitelist)
      if (user.email && allowedUsers.includes(user.email)) {
        return true;
      }
      return false; // Usuário bloqueado se não estiver na lista
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
