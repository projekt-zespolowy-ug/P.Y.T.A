"use client";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { PeriodUnit } from "@/types/stocks";
import type { Dispatch, SetStateAction } from "react";

const PeriodSelect = ({
	period,
	setPeriod,
}: {
	period: PeriodUnit;
	setPeriod: Dispatch<SetStateAction<PeriodUnit>>;
}) => {
	const handlePeriodChange = (value: string) => {
		if (Object.values(PeriodUnit).includes(value as PeriodUnit))
			setPeriod(value as PeriodUnit);
	};

	return (
		<div className="period-picker w-auto">
			<Select value={period} onValueChange={handlePeriodChange}>
				<SelectTrigger>
					<SelectValue placeholder={period.toUpperCase()} />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={PeriodUnit.ONE_YEAR}>1Y</SelectItem>
					<SelectItem value={PeriodUnit.THREE_YEARS}>3Y</SelectItem>
					<SelectItem value={PeriodUnit.FIVE_YEARS}>5Y</SelectItem>
					<SelectItem value={PeriodUnit.ONE_DAY}>1D</SelectItem>
					<SelectItem value={PeriodUnit.THREE_DAYS}>3D</SelectItem>
					<SelectItem value={PeriodUnit.SEVEN_DAYS}>7D</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};

export default PeriodSelect;
