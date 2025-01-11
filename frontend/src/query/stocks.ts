import type { StocksResponse } from "@/types/api-responses";
import { useInfiniteQuery } from "@tanstack/react-query";
import camelcaseKeys from "camelcase-keys";
import { axiosInstance } from "./http";

export type GetStocksParams = {
	limit?: number;
	industry?: string;
	exchange?: string;
};

export const useGetStocks = (params: GetStocksParams = {}) =>
	useInfiniteQuery({
		queryKey: ["stockList", params],
		queryFn: ({ pageParam }) => getStocks({ ...params, page: pageParam }),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) =>
			lastPage.isLastPage ? undefined : allPages.length + 1,
	});

const getStocks = async (params: GetStocksParams & { page: number }) => {
	const res = await axiosInstance.get("/stocks", {
		params,
	});
	return camelcaseKeys(res.data, { deep: true }) as StocksResponse;
};
