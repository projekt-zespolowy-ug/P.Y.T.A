import { PeriodUnit, TimeUnit } from "@/types/stocks";

type SimpleSelect<T> = {
	id: string;
	value: T;
	label: string;
};

type PeriodSelect = SimpleSelect<PeriodUnit>;
type TimeUnitSelect = SimpleSelect<TimeUnit>;

export const periodSelectItems: PeriodSelect[] = [
	{
		id: "fceltf4ktf7s0ty59stwot8pt",
		label: "1D",
		value: PeriodUnit.ONE_DAY,
	},
	{
		id: "mqpq7dysfnt4ctn2ezzo1wso",
		label: "3D",
		value: PeriodUnit.THREE_DAYS,
	},

	{
		id: "cm6vbs55ypj3muc3tbm7bs1m",
		label: "7D",
		value: PeriodUnit.SEVEN_DAYS,
	},
	{
		id: "o909ja689puochbp9jcra29y",
		label: "1Y",
		value: PeriodUnit.ONE_YEAR,
	},
	{
		id: "sgshgx5sc0godbyvxf0so7yj",
		label: "3Y",
		value: PeriodUnit.THREE_YEARS,
	},
	{
		id: "quh90yonq6p1qy4aydzingme",
		label: "5Y",
		value: PeriodUnit.FIVE_YEARS,
	},
];

export const timeUnitSelectItems: TimeUnitSelect[] = [
	{
		id: "pelljbvmxxjiuhyd3rs7nqla",
		label: "1Y",
		value: TimeUnit.YEAR,
	},
	{
		id: "if3az7g6csa582nr4m9lzo1f",
		label: "1MTH",
		value: TimeUnit.MONTH,
	},
	{
		id: "kwtn3qrsjtdljryt2laj97o8",
		label: "1D",
		value: TimeUnit.DAY,
	},
	{
		id: "qcikw2h7tptcfeyrmg0g8ova",
		label: "1H",
		value: TimeUnit.HOUR,
	},
	{
		id: "jbdh69kcs2941avukc3hqgyo",
		label: "15MIN",
		value: TimeUnit.MINUTE,
	},
];
