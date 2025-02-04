"use client";
import { Spinner } from "@/app/[locale]/_components/Spinner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useFormatCurrency } from "@/hooks/useFormatCurrency";
import { useGetStockDetails } from "@/query/stock-details";
import type { StockPriceMessage } from "@/types/stocks";
import { getTickerPrices } from "@/ws/ticker-update";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import StockChart from "./StockChart";

const StockDetailsLayout = ({ ticker }: { ticker: string }) => {
	const { data, isLoading, error } = useGetStockDetails(ticker);
	const t = useTranslations("StockDetails");
	const [latestBuyPrice, setLatestBuyPrice] = useState<number>(0);
	const [latestSellPrice, setLatestSellPrice] = useState<number>(0);

	const formattedBuyPrice = useFormatCurrency(latestBuyPrice);
	const formattedSellPrice = useFormatCurrency(latestSellPrice);

	useEffect(() => {
		const socket = getTickerPrices(ticker, ({ data }) => {
			const parsed = JSON.parse(data) as StockPriceMessage;
			setLatestBuyPrice(parsed.buy);
			setLatestSellPrice(parsed.sell);
		});

		return () => {
			socket.close();
		};
	}, [ticker]);

	if (isLoading || !data) return <Spinner />;
	if (error) return error.message;

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<div className="flex items-center justify-between">
						<div className="stock-left flex flex-col">
							<div>{data?.name}</div>
							<div className="font-normal text-sm">{data?.industry.name}</div>
						</div>
					</div>
				</CardTitle>
				<CardDescription>{data?.description}</CardDescription>
			</CardHeader>
			<CardContent className="p-0">
				<div className="prices flex gap-1 text-xl justify-between p-6">
					<div className="buy flex gap-1">
						<div className="name text-green-600">{t("buttons.buy")}</div>
						<div className="price">{formattedBuyPrice}</div>
					</div>
					<div className="buy flex gap-1">
						<div className="name text-red-600">{t("buttons.sell")}</div>
						<div className="price">{formattedSellPrice}</div>
					</div>
				</div>
				<StockChart ticker={ticker} />
				<div className="buttons flex justify-center gap-2 flex-1 px-6">
					<Button
						className="flex flex-col bg-green-600 px-7 py-8 w-1/2 font-bold"
						// onClick={handleBuy}
					>
						{t("buttons.buy")}
					</Button>
					<Button
						className="flex  flex-col bg-red-600 px-7 py-8 w-1/2 font-bold"
						// onClick={handleSell}
					>
						{t("buttons.sell")}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default StockDetailsLayout;
