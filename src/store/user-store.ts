import { create } from 'zustand';

interface UserState {
  id_user: string | null;
  ds_email: string | null;
  ds_role: string | null;
  isLoaded: boolean;
  setUserInfo: (info: { id_user: string; ds_email: string; ds_role: string }) => void;
  clearUserInfo: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  id_user: null,
  ds_email: null,
  ds_role: null,
  isLoaded: false,
  setUserInfo: (info) => set({ ...info, isLoaded: true }),
  clearUserInfo: () => set({ id_user: null, ds_email: null, ds_role: null, isLoaded: false }),
}));
