"use client";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { TimeUnit } from "@/types/stocks";
import type { Dispatch, SetStateAction } from "react";

const TimeUnitSelect = ({
	timeUnit,
	setTimeUnit,
}: {
	timeUnit: TimeUnit;
	setTimeUnit: Dispatch<SetStateAction<TimeUnit>>;
}) => {
	const handlePeriodChange = (value: string) => {
		if (Object.values(TimeUnit).includes(value as TimeUnit))
			setTimeUnit(value as TimeUnit);
	};

	return (
		<div className="period-picker w-auto">
			<Select value={timeUnit} onValueChange={handlePeriodChange}>
				<SelectTrigger>
					<SelectValue placeholder={timeUnit.toUpperCase()} />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={TimeUnit.YEAR}>1Y</SelectItem>
					<SelectItem value={TimeUnit.MONTH}>1MTH</SelectItem>
					<SelectItem value={TimeUnit.DAY}>1D</SelectItem>
					<SelectItem value={TimeUnit.HOUR}>1H</SelectItem>
					<SelectItem value={TimeUnit.MINUTE}>15MIN</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};

export default TimeUnitSelect;
