"use client";

import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { useGetStocks } from "@/query/stocks";
import { useSearchParamsStore } from "@/store/search-params";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import InfiniteScroll from "../_components/InfiniteScroll";
import StockTable from "../_components/StockTable/StockTable";
import { useColumns } from "../_components/StockTable/useColumns";
import { Spinner } from "./Spinner";

export default function HomePageLayout({
	children,
}: { children?: React.ReactNode }) {
	const tHeaders = useTranslations("StockTable.headers");
	const { exchange, industry, limit, name, order, order_by, setParam } =
		useSearchParamsStore();

	const [searchName, setSearchName] = useState(name);
	const debouncedName = useDebounce(searchName, 250);
	useEffect(() => {
		setParam("name", debouncedName);
	}, [debouncedName, setParam]);

	const {
		data: stockPages,
		isSuccess,
		isLoading,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
	} = useGetStocks({ exchange, industry, limit, name, order, order_by });

	const stocks = stockPages?.pages.flatMap((x) => x.stocks);
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
			<div className="flex items-center py-4 justify-center gap-2">
				{children}
			</div>
			<div className="flex items-center py-4 justify-center">
				<Input
					placeholder={tHeaders("search")}
					value={searchName ?? ""}
					onChange={(event) => setSearchName(event.target.value)}
					className="max-w-sm"
				/>
			</div>
			<div className="container mx-auto pb-10">
				{isSuccess ? (
					<StockTable data={stocks || []} columns={columns} />
				) : (
					<Spinner />
				)}
			</div>
		</InfiniteScroll>
	);
}
