import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface UserStore {
	hashedEmail: string;
	name: string;
	lastName: string;
	isAuthenticated: boolean;
	balance: number;
}
const initialState: UserStore = {
	hashedEmail: "",
	name: "",
	lastName: "",
	isAuthenticated: false,
	balance: 0,
};

export const useUserStore = create<UserStore>()(
	devtools((set) => ({
		...initialState,
	})),
);
