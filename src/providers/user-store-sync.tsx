"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/store/user-store";

export function UserStoreSync() {
  const { data: session, status } = useSession();
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const clearUserInfo = useUserStore((state) => state.clearUserInfo);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUserInfo({
        id_user: session.user.id_user,
        ds_email: session.user.email as string,
        ds_role: session.user.ds_role,
      });
    } else if (status === "unauthenticated") {
      clearUserInfo();
    }
  }, [session, status, setUserInfo, clearUserInfo]);

  return null;
}
