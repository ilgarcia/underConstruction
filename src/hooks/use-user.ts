import { useUserStore } from "@/store/user-store";

export function useUser() {
  const user = useUserStore((state) => ({
    id_user: state.id_user,
    ds_email: state.ds_email,
    ds_role: state.ds_role,
    isLoaded: state.isLoaded,
  }));

  return user;
}
