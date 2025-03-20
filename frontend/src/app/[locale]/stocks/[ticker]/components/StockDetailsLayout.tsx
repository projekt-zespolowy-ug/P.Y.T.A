"use client";
import MyTooltip from "@/app/[locale]/_components/MyTooltip";
import { Spinner } from "@/app/[locale]/_components/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	getFormatCurrency,
	getFormatCurrencyString,
	useFormatCurrency,
} from "@/hooks/useFormatCurrency";
import { useGetUser } from "@/query/auth";
import { useGetStockDetails } from "@/query/stock-details";
import { useStockTransaction } from "@/query/transaction";
import { createPriceHandler, stockUpdateClient } from "@/ws";
import type { AxiosError } from "axios";
import { ExternalLinkIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import StockChart from "./StockChart";

const StockDetailsLayout = ({ ticker }: { ticker: string }) => {
	const { data, isLoading, error } = useGetStockDetails(ticker);
	const t = useTranslations("StockDetails");
	const [latestBuyPrice, setLatestBuyPrice] = useState<number>(0);
	const [latestSellPrice, setLatestSellPrice] = useState<number>(0);
	const [amount, setAmount] = useState<number>(1);
	const locale = useLocale();
	const { isSuccess: isLogged } = useGetUser();

	const formattedBuyPrice = useFormatCurrency(latestBuyPrice);
	const formattedSellPrice = useFormatCurrency(latestSellPrice);
	const { mutate: buyStock } = useStockTransaction("buy", ticker);
	const { mutate: sellStock } = useStockTransaction("sell", ticker);

	useEffect(() => {
		const priceHandler = createPriceHandler(ticker, (event) => {
			setLatestBuyPrice(event.detail[ticker].buy);
			setLatestSellPrice(event.detail[ticker].sell);
		});

		stockUpdateClient.subscribe([ticker]);
		stockUpdateClient.addPriceHandler(priceHandler);

		return () => {
			stockUpdateClient.unsubscribe([ticker]);
			stockUpdateClient.removePriceHandler(priceHandler);
		};
	}, [ticker]);

	const amountSchema = z
		.number()
		.min(0, { message: "Amount must be greater than or equal to 0" })
		.multipleOf(0.00001, {
			message: "Amount cannot have more than 5 decimal places",
		});

	function handleTransaction(
		transactionFn: typeof buyStock | typeof sellStock,
	) {
		const isBuy = transactionFn === buyStock;
		const defaultStyle = "text-white border-black";
		transactionFn(
			{ amount },
			{
				onSuccess: (data) => {
					toast(
						t("messages.transactionSuccess", {
							amount: data.amount,
							ticker,
							price: getFormatCurrencyString(
								getFormatCurrency(data.unitPrice, locale),
								locale,
							),
							action: isBuy ? t("actions.bought") : t("actions.sold"),
						}),
						{
							className: `${isBuy ? "bg-green-600" : "bg-red-600"} ${defaultStyle}`,
						},
					);
				},
				onError: (e) => {
					const { status } = e as AxiosError;
					if (status === 400) {
						toast(t("messages.insufficientStocks"), {
							className: `bg-red-600 ${defaultStyle}`,
						});
					} else if (status === 402) {
						toast(t("messages.insufficientFunds"), {
							className: `bg-red-600 ${defaultStyle}`,
						});
					} else if (status === 404) {
						toast(t("messages.stockNotFound"), {
							className: `bg-red-600 ${defaultStyle}`,
						});
					} else if (status === 422) {
						toast(t("messages.incorrectAmount"), {
							className: `bg-red-600 ${defaultStyle}`,
						});
					} else {
						toast(t("messages.serverErr"), {
							className: `bg-red-600 ${defaultStyle}`,
						});
					}
				},
			},
		);
	}

	if (isLoading || !data) return <Spinner />;
	if (error) return error.message;

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<div className="flex items-center justify-between">
						<div className="stock-left flex flex-col">
							<div className="flex gap-1">
								<span className="name">{data?.name}</span>
								<span className="company-link">
									<MyTooltip tooltipContent={<span>{data?.description}</span>}>
										<a
											target="_blank"
											rel="noreferrer"
											href={data?.description}
										>
											<ExternalLinkIcon />
										</a>
									</MyTooltip>
								</span>
							</div>
							<div className="font-normal text-sm">{data?.industry.name}</div>
						</div>
					</div>
				</CardTitle>
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
				{isLogged && (
					<>
						<div className="flex p-6">
							<Input
								type="number"
								placeholder="0"
								value={amount || ""}
								onChange={(e) => setAmount(e.target.valueAsNumber)}
							/>
						</div>
						<div className="buttons flex justify-center gap-2 flex-1 px-6 mb-6">
							<Button
								className="flex flex-col bg-green-600 px-7 py-8 w-1/2 font-bold"
								disabled={!amountSchema.safeParse(amount).success}
								onClick={() => {
									handleTransaction(buyStock);
								}}
							>
								{t("buttons.buy")}
							</Button>
							<Button
								className="flex  flex-col bg-red-600 px-7 py-8 w-1/2 font-bold"
								disabled={!amountSchema.safeParse(amount).success}
								onClick={() => {
									handleTransaction(sellStock);
								}}
							>
								{t("buttons.sell")}
							</Button>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
};

export default StockDetailsLayout;
