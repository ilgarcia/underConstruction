import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Returns the session if the user is authenticated, 
 * otherwise returns a 401 Unauthorized response.
 */
export async function getRequiredSession() {
  const session = (await getServerSession(authOptions)) as Session & {
    user: { id_user: string };
  };

  if (!session?.user?.id_user) {
    return {
      session: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { session, response: null };
}
