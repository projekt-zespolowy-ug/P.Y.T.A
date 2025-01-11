"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { type GetStocksParams, useGetStocks } from "@/query/stocks";
import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import InfiniteScroll from "./_components/InfiniteScroll";
import StockTable from "./_components/StockTable/StockTable";
import { useColumns } from "./_components/StockTable/useColumns";

export default function Home() {
	const tHeaders = useTranslations("StockTable.headers");
	const tSelects = useTranslations("StockTable.selects");
	const [getStockParams, setGetStocksParams] = useState<GetStocksParams>({
		limit: 10,
	});
	const {
		data: stockPages,
		isSuccess,
		isLoading,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
	} = useGetStocks(getStockParams);

	if (!isSuccess) {
		return <LoaderCircle className="mx-auto my-10 animate-spin" />;
	}

	const stocks = stockPages.pages.flatMap((x) => x.stocks);
	const columns = useColumns({
		logo: tHeaders("logo"),
		ticker: tHeaders("ticker"),
		name: tHeaders("name"),
		buy: tHeaders("buy"),
		sell: tHeaders("sell"),
	});

	return (
		<InfiniteScroll
			isLoadingIntial={isLoading}
			isLoadingMore={isFetchingNextPage}
			loadMore={() => hasNextPage && fetchNextPage()}
		>
			{/* select components will be refactored once the backend is updated with new routes */}
			<div className="flex items-center py-4 justify-center gap-2">
				<Select
					onValueChange={(value) => {
						setGetStocksParams((prev) => ({
							...prev,
							industry: value,
						}));
					}}
					value={getStockParams.industry}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder={tSelects("industry")} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="Advertising">Advertising</SelectItem>
						<SelectItem value="Oil & Gas Production">
							Oil & Gas Production
						</SelectItem>
					</SelectContent>
				</Select>

				<Select
					onValueChange={(value) => {
						setGetStocksParams((prev) => ({
							...prev,
							exchange: value,
						}));
					}}
					value={getStockParams.exchange}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder={tSelects("exchange")} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="NYSE">NYSE</SelectItem>
						<SelectItem value="NASDAQ">NASDAQ</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="container mx-auto pb-10">
				<StockTable data={stocks} columns={columns} />
			</div>
		</InfiniteScroll>
	);
}
