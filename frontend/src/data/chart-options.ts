export const candleChartOptions: echarts.EChartsOption = {
	title: {
		left: "center",
	},
	tooltip: {
		trigger: "axis",
		axisPointer: {
			type: "cross",
		},
	},
	toolbox: {
		show: false,
	},
	xAxis: {
		type: "category",
		data: [],
		axisLabel: {
			formatter: (value: string) => value,
		},
		boundaryGap: false,
		axisPointer: {
			z: 100,
		},
	},
	yAxis: {
		type: "value",
		scale: true,
		axisLabel: {
			formatter: (value) => "a",
		},
		splitArea: {
			show: true,
		},
		min: "dataMin",
		max: "dataMax",
	},
	dataZoom: [
		{
			type: "inside",
			start: 0,
			end: 100,
			minValueSpan: 10,
		},
	],
	series: [],
	grid: {
		left: "10%",
		right: "10%",
		bottom: "15%",
		containLabel: true,
	},
	brush: {
		toolbox: ["lineX", "clear"],
		xAxisIndex: "all",
	},
};

export const candleChartSeries: echarts.SeriesOption = {
	type: "candlestick",
	itemStyle: {
		color: "#0b0",
		color0: "#f00",
		borderColor: "#0b0",
		borderColor0: "#f00",
	},
};
