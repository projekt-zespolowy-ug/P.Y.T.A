import type { GetStocksParams } from "@/query/stocks";
import { create } from "zustand";

type GetStocksParamsStore = GetStocksParams & {
	setParam: <K extends keyof GetStocksParams>(
		key: K,
		value: GetStocksParams[K],
	) => void;
	resetSort: () => void;
};

export const useSearchParamsStore = create<GetStocksParamsStore>()((set) => ({
	limit: 10,
	setParam: (key, value) => set((state) => ({ ...state, [key]: value })),
	resetSort: () =>
		set((state) => ({ ...state, order: undefined, order_by: undefined })),
}));
