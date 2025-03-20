"use client";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { timeUnitSelectItems } from "@/data/selects";
import type { TimeUnit } from "@/types/stocks";
import type { Dispatch, SetStateAction } from "react";

const TimeUnitSelect = ({
	timeUnit,
	setTimeUnit,
}: {
	timeUnit: TimeUnit;
	setTimeUnit: Dispatch<SetStateAction<TimeUnit>>;
}) => {
	const handlePeriodChange = (value: TimeUnit) => {
		setTimeUnit(value);
	};

	return (
		<div className="period-picker w-auto">
			<Select value={timeUnit} onValueChange={handlePeriodChange}>
				<SelectTrigger>
					<SelectValue placeholder={timeUnit.toUpperCase()} />
				</SelectTrigger>
				<SelectContent>
					{timeUnitSelectItems.map(({ id, label, value }) => (
						<SelectItem key={id} value={value}>
							{label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};

export default TimeUnitSelect;
