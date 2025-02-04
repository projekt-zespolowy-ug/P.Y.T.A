"use client";

import * as echarts from "echarts";

import { candleChartOptions, candleChartSeries } from "@/data/chart-options";
import {
	getFormatCurrency,
	getFormatCurrencyString,
} from "@/hooks/useFormatCurrency";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useMemo, useRef } from "react";

import { useGetStockHistory } from "@/query/stock-details";
import moment from "moment";

const StockChart = ({ ticker }: { ticker: string }) => {
	const period = "100y";
	const timeUnit = "h";
	const t = useTranslations("StockDetails.tooltip");
	const chartRef = useRef<HTMLDivElement | null>(null);
	const { data, error, isLoading } = useGetStockHistory(
		ticker,
		period,
		timeUnit,
	);
	const locale = useLocale();

	const yAxisFormatter = useMemo(
		() => (value: number) => getFormatCurrencyString(value, locale),
		[locale],
	);

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
					${t("open")}: ${yAxisFormatter(open)}<br/>
					${t("close")}: ${yAxisFormatter(close)}<br/>
					${t("low")}: ${yAxisFormatter(lowest)}<br/>
					${t("High")}: ${yAxisFormatter(highest)}
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

	return <div className="chart w-full h-96 px-1" ref={chartRef} />;
};

export default StockChart;
