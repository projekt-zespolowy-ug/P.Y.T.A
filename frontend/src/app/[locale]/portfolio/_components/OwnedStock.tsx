"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useFormatCurrency } from "@/hooks/useFormatCurrency";
import type { PortfolioItem, StockPriceMessage } from "@/types/stocks";
import { getTickerPrices } from "@/ws/ticker-update";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const OwnedStock = ({ item }: { item: PortfolioItem }) => {
	const t = useTranslations("Portfolio");
	const locale = useLocale();
	const [currentPrice, setCurrentPrice] = useState(item.price);
	const [prevPrice, setPrevPrice] = useState(item.price);
	const totalValue = currentPrice * item.amount;
	const totalValueFormatted = useFormatCurrency(totalValue);
	const currentPriceFormatted = useFormatCurrency(currentPrice);

	const currentPriceStyle =
		prevPrice > currentPrice
			? "text-red-700"
			: prevPrice < currentPrice
				? "text-green-700"
				: null;

	useEffect(() => {
		const socket = getTickerPrices(item.ticker, ({ data }) => {
			const parsed = JSON.parse(data) as StockPriceMessage;

			setCurrentPrice((prev) => {
				setPrevPrice(prev);
				return parsed.sell;
			});
		});

		return () => {
			socket.close();
		};
	}, [item.ticker]);
	return (
		<Card>
			<CardHeader className="flex justify-between m-2">
				<div className="left flex flex-col">
					<Link href={`/${locale}/stocks/${item.ticker}`}>
						<CardTitle>{item.name}</CardTitle>
					</Link>
					<Link href={`/${locale}/stocks/${item.ticker}`}>
						<CardDescription>{item.ticker}</CardDescription>
					</Link>
				</div>
				<div className={`right ${currentPriceStyle}`}>
					<p>{currentPriceFormatted}</p>
				</div>
			</CardHeader>
			<CardContent className="flex justify-evenly">
				<p>
					{t("ownedAmount")} {item.amount}
				</p>
				<p>
					{t("totalValue")}{" "}
					<span className={`${currentPriceStyle}`}>{totalValueFormatted}</span>
				</p>
			</CardContent>
		</Card>
	);
};
export default OwnedStock;
