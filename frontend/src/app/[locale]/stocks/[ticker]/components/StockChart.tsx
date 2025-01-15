"use client";
import { candleChartOptions, candleChartSeries } from "@/data/chart-options";
import {
	getFormatCurrency,
	getFormatCurrencyString,
} from "@/hooks/useFormatCurrency";
import { useGetStockHistory } from "@/query/stock-details";
import * as echarts from "echarts";
import moment from "moment";
import { useLocale } from "next-intl";
import React, { useEffect, useMemo, useRef } from "react";

const StockChart = ({ ticker }: { ticker: string }) => {
	// const [period, setPeriod] = useState("100y");
	// const [timeUnit, setTimeUnit] = useState("h");
	const period = "100y";
	const timeUnit = "h";

	const chartRef = useRef<HTMLDivElement | null>(null);
	const { data, error, isLoading } = useGetStockHistory(
		ticker,
		period,
		timeUnit,
	);
	const locale = useLocale();

	const yAxisFormatter = (value: number) =>
		getFormatCurrencyString(value, locale);

	// biome-ignore lint/correctness/useExhaustiveDependencies: yAxisFormatter should not be in useEffect because locale is there already
	useEffect(() => {
		if (!chartRef.current || !data || data.length === 0) return;

		const [timestamps, prices] = data.reduce<[string[], number[][]]>(
			([timestampAcc, pricesAcc], curr) => {
				const { timestamp, close, max, min, open } = curr;

				const formattedDate = moment(timestamp).format("YYYY-MM-DD HH:mm");

				const formattedPrices = [open, close, min, max].map((pc) => {
					const formattedToCurrency = getFormatCurrency(pc, locale);
					return Math.round(formattedToCurrency * 100) / 100;
				});

				return [
					[...timestampAcc, formattedDate],
					[...pricesAcc, formattedPrices],
				];
			},
			[[], []],
		);

		const chart = echarts.init(chartRef.current);
		const series = {
			...candleChartSeries,
			data: prices,
		} as echarts.SeriesOption;
		const newOptions: echarts.EChartsOption = {
			...candleChartOptions,
			title: { ...candleChartOptions.title, text: ticker },
			xAxis: { ...candleChartOptions.xAxis, data: timestamps },
			yAxis: {
				...candleChartOptions.yAxis,
				type: "time",
				boundaryGap: ["0%", "0%"],
				axisLabel: {
					formatter: yAxisFormatter,
				},
			},

			series: [series],
		};

		chart.setOption(newOptions);

		return () => {
			chart.dispose();
		};
	}, [data, locale, ticker]);

	if (isLoading) return "Loading...";
	if (error) return error.message;

	return <div className="chart w-full h-96 px-1" ref={chartRef} />;
};

export default StockChart;
