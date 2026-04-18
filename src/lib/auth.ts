import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabaseAdmin } from "./supabase";

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
  pages: {
    error: "/",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      try {
        // 1. Verificar se o e-mail está na whitelist e se o status é 'accepted'
        const { data: allowed, error: allowedError } = await supabaseAdmin
          .from('tbl_allowed_users')
          .select('ds_invite_status')
          .eq('ds_email', user.email)
          .single();

        if (allowedError || !allowed || allowed.ds_invite_status !== 'accepted') {
          console.warn(`Acesso negado para: ${user.email} (Status: ${allowed?.ds_invite_status || 'Inexistente'})`);
          return false;
        }

        // 2. Se permitido, sincronizar com tbl_users
        const { error } = await supabaseAdmin
            .from('tbl_users')
            .upsert(
              { ds_email: user.email },
              { onConflict: 'ds_email' }
            );

          if (error) {
            console.error('Error syncing user with Supabase:', error);
          }
        } catch (err) {
          console.error('Unexpected error during Supabase sync:', err);
        }
        return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id_user = token.id_user as string;
        session.user.ds_role = token.ds_role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user || !token.id_user) {
        const { data, error } = await supabaseAdmin
          .from('tbl_users')
          .select('id_user, ds_role')
          .eq('ds_email', token.email)
          .single();

        if (data && !error) {
          token.id_user = data.id_user;
          token.ds_role = data.ds_role;
        }
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
