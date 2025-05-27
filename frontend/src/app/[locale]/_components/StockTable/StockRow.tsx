"use client";
import { TableRow } from "@/components/ui/table";
import { useRouter } from "@/i18n/routing";
import type { Stock } from "@/types/stocks";
import { createPriceHandler, stockUpdateClient } from "@/ws";
import type { Row } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import StockCell from "./StockCell";

interface TickerItemProps {
	row: Row<Stock>;
}

export default function StockRow({ row }: TickerItemProps) {
	const [prices, setPrices] = useState<{ buy: number; sell: number }>({
		buy: row.getValue<number>("buy"),
		sell: row.getValue<number>("sell"),
	});
	const ticker = row.getValue<string>("ticker");

	const { ref, inView } = useInView({
		threshold: 0.1,
	});

	const router = useRouter();

	useEffect(() => {
		const priceHandler = createPriceHandler(ticker, (event) => {
			setPrices(event.detail[ticker]);
		});

		if (!inView) {
			return;
		}
		stockUpdateClient.subscribe([ticker]);
		stockUpdateClient.addPriceHandler(priceHandler);

		return () => {
			stockUpdateClient.unsubscribe([ticker]);
			stockUpdateClient.removePriceHandler(priceHandler);
		};
	}, [ticker, inView]);

	row.original.buy = prices.buy;
	row.original.sell = prices.sell;

	return (
		<TableRow
			data-ticker={row.original.ticker}
			ref={ref}
			key={row.id}
			data-state={row.getIsSelected() && "selected"}
			onClick={() => router.push(`/stocks/${ticker}`)}
			className="hover:cursor-pointer"
		>
			{row.getVisibleCells().map((cell) => (
				<StockCell key={cell.id} cell={cell} />
			))}
		</TableRow>
	);
}
