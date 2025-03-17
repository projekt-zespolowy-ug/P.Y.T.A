"use client";

import { Spinner } from "@/app/[locale]/_components/Spinner";
import {
	getFormatCurrency,
	getFormatCurrencyString,
} from "@/hooks/useFormatCurrency";
import { useGetStockHistory } from "@/query/stock-details";
import type { ApexOptions } from "apexcharts";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import React, { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";

const ReactStockChart = ({ ticker }: { ticker: string }) => {
	const [period, setPeriod] = useState("100y");
	const [timeUnit, setTimeUnit] = useState("h");
	const t = useTranslations("StockDetails.tooltip");

	const { data, error, isLoading, refetch } = useGetStockHistory(
		ticker,
		period,
		timeUnit,
	);
	const locale = useLocale();
	const { resolvedTheme } = useTheme();
	const yAxisFormatter = useMemo(
		() => (value: number) => getFormatCurrencyString(value, locale),
		[locale],
	);

	const transformedChartData = useMemo(() => {
		if (!data || data.length === 0) return [];

		return data.map(({ timestamp, open, close, min, max }) => ({
			x: new Date(timestamp),
			y: [open, max, min, close].map(
				(price) => Math.round(getFormatCurrency(price, locale) * 100) / 100,
			),
		}));
	}, [data, locale]);

	const [chartOptions, setChartOptions] = useState<{
		series: { data: { x: Date; y: number[] }[] }[];
		options: ApexOptions;
	}>({
		series: [{ data: [] }],
		options: {
			chart: {
				type: "candlestick",
				height: 350,
			},
			title: {
				text: ticker,
				align: "left",
			},
			xaxis: {
				labels: {
					format: "dd/MM",
					hideOverlappingLabels: true,
					formatter: (value: string) => {
						const date = new Date(value);
						return date.toLocaleDateString(locale, {
							day: "2-digit",
							month: "2-digit",
							year: "numeric",
						});
					},
				},
			},

			yaxis: {
				tooltip: { enabled: true },
				labels: {
					formatter(val, opts) {
						return yAxisFormatter(val);
					},
				},
			},
			tooltip: {
				custom: ({ series, seriesIndex }) => {
					const [open, highest, lowest, close] = series[seriesIndex];
					return `<div>${t("open")}: <b>${yAxisFormatter(open)}</b><br/>
					${t("close")}: <b>${yAxisFormatter(close)}</b><br/>
					${t("low")}: <b>${yAxisFormatter(lowest)}</b><br/>
					${t("high")}: <b>${yAxisFormatter(highest)}</b>
					</div>`;
				},
				theme: resolvedTheme,
			},
		},
	});

	useEffect(() => {
		refetch();
	}, [timeUnit, refetch]);

	useEffect(() => {
		setChartOptions((prev) => ({
			...prev,
			options: { tooltip: { theme: resolvedTheme } },
		}));
	}, [resolvedTheme]);

	useEffect(() => {
		console.log("Updating chart data");
		setChartOptions((prev) => ({
			...prev,
			series: [{ data: transformedChartData }],
		}));
	}, [transformedChartData]);

	if (isLoading) return <Spinner />;
	if (error) return <div className="error">{error.message}</div>;

	return (
		<ReactApexChart
			options={chartOptions.options}
			series={chartOptions.series}
			type="candlestick"
			height={350}
		/>
	);
};

export default ReactStockChart;
