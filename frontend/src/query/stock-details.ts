import type { GetStockDetailsResponse } from "@/types/api-responses";
import { useQuery } from "@tanstack/react-query";
import type { StockHistory } from "../types/api-responses";
import { axiosInstance } from "./http";

export const useGetStockDetails = (ticker: string) =>
	useQuery({
		queryKey: ["stockDetails", ticker],
		queryFn: () => getStockDetails(ticker),
	});

const getStockDetails = async (ticker: string) =>
	(await axiosInstance.get(`/stocks/${ticker}`))
		.data as GetStockDetailsResponse;

export const useGetStockHistory = (
	ticker: string,
	period: string,
	timeUnit: string,
) =>
	useQuery({
		queryKey: ["stockPriceHistory", ticker],
		queryFn: () => getStockHistory(ticker, period, timeUnit),
	});

const getStockHistory = async (
	ticker: string,
	period: string,
	timeUnit: string,
) =>
	(
		await axiosInstance.get(`/stocks/price/${ticker}`, {
			params: {
				period,
				time_unit: timeUnit,
			},
		})
	).data as StockHistory[];
