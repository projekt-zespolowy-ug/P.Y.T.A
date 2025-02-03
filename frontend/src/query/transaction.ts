import type { TransactionRequestBody } from "@/types/api-requests";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "./http";

export const useStockTransaction = (type: "buy" | "sell", ticker: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: TransactionRequestBody) =>
			stockTransaction(type, ticker, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
	});
};

const stockTransaction = async (
	type: "buy" | "sell",
	ticker: string,
	data: TransactionRequestBody,
) => {
	return (await axiosInstance.post(`/stocks/${ticker}/${type}`, data)).data;
};
