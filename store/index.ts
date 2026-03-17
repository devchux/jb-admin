import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { authSlice, type AuthSlice } from "./slice/auth";

export type Store = AuthSlice & {
  reset: () => void;
};

export const useStore = create<Store>()(
  persist(
    (...a) => ({
      ...authSlice(...a),
      reset: () => {
        authSlice(...a).resetAuth();
      },
    }),
    {
      name: "jaiz",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
