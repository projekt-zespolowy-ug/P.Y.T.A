"use client";

import * as echarts from "echarts";

import { candleChartOptions, candleChartSeries } from "@/data/chart-options";
import {
	getFormatCurrency,
	getFormatCurrencyString,
} from "@/hooks/useFormatCurrency";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useMemo, useRef, useState } from "react";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useGetStockHistory } from "@/query/stock-details";
import { TimeUnit } from "@/types/stocks";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";

const StockChart = ({ ticker }: { ticker: string }) => {
	const [period, setPeriod] = useState("100y");
	const [timeUnit, setTimeUnit] = useState("h");
	const t = useTranslations("StockDetails.tooltip");
	const chartRef = useRef<HTMLDivElement | null>(null);
	const queryClient = useQueryClient();
	const { data, error, isLoading, refetch } = useGetStockHistory(
		ticker,
		period,
		timeUnit,
	);
	const locale = useLocale();

	const yAxisFormatter = useMemo(
		() => (value: number) => getFormatCurrencyString(value, locale),
		[locale],
	);

	const handleTimeUnitChange = async (timeUnitValue: string) => {
		setTimeUnit(timeUnitValue);
		// await refetch();
		// queryClient.invalidateQueries({ queryKey: ["stockPriceHistory", ticker] });
	};

	const transformChartData = useMemo(() => {
		if (!data || data.length === 0) return { timestamps: [], prices: [] };

		return data.reduce<{
			timestamps: string[];
			prices: number[][];
		}>(
			(acc, { timestamp, open, close, min, max }) => {
				const formattedDate = moment(timestamp).format("YYYY-MM-DD");

				const formattedPrices = [open, close, min, max].map(
					(price) => Math.round(getFormatCurrency(price, locale) * 100) / 100,
				);

				acc.timestamps.push(formattedDate);
				acc.prices.push(formattedPrices);

				return acc;
			},
			{ timestamps: [], prices: [] },
		);
	}, [data, locale]);

	useEffect(() => {
		refetch();
	}, [timeUnit, refetch]);

	useEffect(() => {
		if (!chartRef.current || !transformChartData.timestamps.length) return;

		const chart = echarts.init(chartRef.current);
		const series = {
			...candleChartSeries,
			data: transformChartData.prices,
		} as echarts.SeriesOption;

		const newOptions: echarts.EChartsOption = {
			...candleChartOptions,
			title: { ...candleChartOptions.title, text: ticker },
			xAxis: {
				...candleChartOptions.xAxis,
				data: transformChartData.timestamps,
			},
			yAxis: {
				...candleChartOptions.yAxis,
				type: "value",
				boundaryGap: ["0%", "0%"],
				axisLabel: {
					formatter: yAxisFormatter,
				},
			},
			tooltip: {
				formatter: (params) => {
					// @ts-expect-error: echarts provide value property, but it does not exist in the type.

					const [_, open, close, lowest, highest] = params.value;

					return `
        ${t("open")}: <b>${yAxisFormatter(open)}</b><br/>
        ${t("close")}: <b>${yAxisFormatter(close)}</b><br/>
        ${t("low")}: <b>${yAxisFormatter(lowest)}</b><br/>
        ${t("high")}: <b>${yAxisFormatter(highest)}</b>
        `;
				},
			},

			series: [series],
		};

		chart.setOption(newOptions);

		return () => {
			chart.dispose();
		};
	}, [transformChartData, ticker, yAxisFormatter, t]);

	if (isLoading) return;
	if (error) return <div className="error">{error.message}</div>;

	return (
		<div className="flex flex-col">
			<div>
				<div className="period-picker w-auto">
					<Select
						value={timeUnit}
						onValueChange={(value) => handleTimeUnitChange(value)}
					>
						<SelectTrigger>
							<SelectValue placeholder={timeUnit.toUpperCase()} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={TimeUnit.YEAR}>1Y</SelectItem>
							<SelectItem value={TimeUnit.MONTH}>1MTH</SelectItem>
							<SelectItem defaultChecked value={TimeUnit.DAY}>
								1D
							</SelectItem>
							<SelectItem value={TimeUnit.HOUR}>1H</SelectItem>
							<SelectItem value={TimeUnit.MINUTE}>15MIN</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div
				className="chart w-full h-96 px-1 min-w-[300px] max-w-[100%] m-auto"
				ref={chartRef}
			/>
		</div>
	);
};

export default StockChart;
