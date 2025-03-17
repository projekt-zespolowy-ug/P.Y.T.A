"use client";

import { Spinner } from "@/app/[locale]/_components/Spinner";
import { Label } from "@/components/ui/label";
import {
	getFormatCurrency,
	getFormatCurrencyString,
} from "@/hooks/useFormatCurrency";
import { useGetStockHistory } from "@/query/stock-details";
import { PeriodUnit, TimeUnit } from "@/types/stocks";
import type { ApexOptions } from "apexcharts";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import React, { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import PeriodSelect from "./PeriodSelect";
import TimeUnitSelect from "./TimeUnitSelect";

const StockChart = ({ ticker }: { ticker: string }) => {
	const [period, setPeriod] = useState(PeriodUnit.ONE_YEAR);
	const [timeUnit, setTimeUnit] = useState(TimeUnit.HOUR);
	const t = useTranslations("StockDetails");

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
			y: [open, max, min, close].map((price) =>
				getFormatCurrency(price, locale),
			),
		}));
	}, [data, locale]);
	const getTooltipContentDiv = (
		open: number,
		close: number,
		lowest: number,
		highest: number,
	) => `<div className="flex flex-col">
			<div>
				${t("tooltip.open")}: <b>${yAxisFormatter(open)}</b>
			</div>
			<div>
				${t("tooltip.close")}: <b>${yAxisFormatter(close)}</b>
			</div>
			<div>
				${t("tooltip.low")}: <b>${yAxisFormatter(lowest)}</b>
			</div>
			<div>
				${t("tooltip.high")}: <b>${yAxisFormatter(highest)}</b>
			</div>
		</div>`;
	const [chartOptions, setChartOptions] = useState<{
		series: { data: { x: Date; y: number[] }[] }[];
		options: ApexOptions;
	}>({
		series: [{ data: [] }],
		options: {
			theme: {
				mode: resolvedTheme === "dark" ? "dark" : "light",
			},
			chart: {
				type: "candlestick",
				height: 350,
				toolbar: {},
			},
			title: {
				text: ticker,
				align: "center",
			},
			xaxis: {
				type: "datetime",
				labels: {
					hideOverlappingLabels: true,
				},
			},

			yaxis: {
				tooltip: { enabled: true },
				labels: {
					formatter: (val) => yAxisFormatter(val),
				},
			},

			tooltip: {
				custom: ({ series, seriesIndex, dataPointIndex, w }) => {
					const open = w.globals.seriesCandleO[seriesIndex][dataPointIndex];
					const high = w.globals.seriesCandleH[seriesIndex][dataPointIndex];
					const low = w.globals.seriesCandleL[seriesIndex][dataPointIndex];
					const close = w.globals.seriesCandleC[seriesIndex][dataPointIndex];
					return getTooltipContentDiv(open, close, low, high);
				},
				theme: resolvedTheme,
			},
		},
	});

	useEffect(() => {
		refetch();
	}, [timeUnit]);

	useEffect(() => {
		setChartOptions((prev) => ({
			...prev,
			options: {
				...prev.options,
				tooltip: { ...prev.options.tooltip, theme: resolvedTheme },
			},
		}));
	}, [resolvedTheme]);

	useEffect(() => {
		setChartOptions((prev) => ({
			...prev,
			series: [
				{ data: transformedChartData.length ? transformedChartData : [] },
			],
		}));
	}, [transformedChartData]);

	if (isLoading) return <Spinner />;
	if (error) return <div className="error">{error.message}</div>;

	return (
		<div className="flex flex-col gap-1">
			<div className="options flex  justify-between flex-1 m-2">
				<div className="option">
					<Label>{t("labels.period")}</Label>
					<PeriodSelect setPeriod={setPeriod} period={period} />
				</div>
				<div className="option">
					<Label>{t("labels.timeUnit")}</Label>
					<TimeUnitSelect timeUnit={timeUnit} setTimeUnit={setTimeUnit} />
				</div>
			</div>
			<ReactApexChart
				options={chartOptions.options}
				series={chartOptions.series}
				type="candlestick"
				height={350}
			/>
		</div>
	);
};

export default StockChart;
