import type { User } from "@/types/user";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type UserActions = {
	setHashedEmail: (hashedEmail: string) => void;
	setFirstName: (firstName: string) => void;
	setLastName: (lastName: string) => void;
	setIsAuthenticated: (isAuthenticated: boolean) => void;
	setBalance: (balance: number) => void;
	updateUser: (user: Partial<User>) => void;
	resetUser: () => void;
};

type UserStore = User & UserActions;

const initialState: User = {
	hashedEmail: "",
	firstName: "",
	lastName: "",
	isAuthenticated: false,
	balance: 0,
};

export const useUserStore = create<UserStore>()(
	persist(
		devtools((set) => ({
			...initialState,
			setHashedEmail: (hashedEmail: string) => set({ hashedEmail }),
			setFirstName: (firstName: string) => set({ firstName }),
			setLastName: (lastName: string) => set({ lastName }),
			setIsAuthenticated: (isAuthenticated: boolean) =>
				set({ isAuthenticated }),
			setBalance: (balance: number) => set({ balance }),
			updateUser: (newUser: Partial<User>) =>
				set((user) => ({ ...user, ...newUser })),
			resetUser: () => set({ ...initialState }),
		})),
		{ name: "user-store" },
	),
);
