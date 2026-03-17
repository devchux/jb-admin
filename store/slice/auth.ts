import { User } from "@/types/common";
import { type StateCreator } from "zustand";

export interface Auth {
  access: string;
  refresh: string;
  user: User;
}

export type AuthSlice = Auth & {
  setToken: (access: string, refresh: string) => void;
  setUser: (value: User) => void;
  setAuth: (value: Auth) => void;
  resetAuth: () => void;
};

const defaults: Auth = {
  access: "",
  refresh: "",
  user: {} as User,
};

export const authSlice: StateCreator<AuthSlice> = (set, get) => ({
  ...defaults,

  setToken: (access: string, refresh: string) => set({ access, refresh }),

  setUser: (value: User) => set({ user: value }),

  setAuth: (value: Auth) => set({ ...get(), ...value }),

  resetAuth: () => set(defaults),
});
