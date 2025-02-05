import type { TransactionRequestBody } from "@/types/api-requests";
import type { TransactionResponse } from "@/types/api-responses";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import camelCaseKeys from "camelcase-keys";
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
	const responseData = (
		await axiosInstance.post(`/stocks/${ticker}/${type}`, data)
	).data;
	return camelCaseKeys(responseData, { deep: true }) as TransactionResponse;
};
