"use client";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { periodSelectItems } from "@/data/selects";
import type { PeriodUnit } from "@/types/stocks";
import type { Dispatch, SetStateAction } from "react";

const PeriodSelect = ({
	period,
	setPeriod,
}: {
	period: PeriodUnit;
	setPeriod: Dispatch<SetStateAction<PeriodUnit>>;
}) => {
	const handlePeriodChange = (value: PeriodUnit) => {
		setPeriod(value);
	};
	return (
		<div className="period-picker w-auto">
			<Select value={period} onValueChange={handlePeriodChange}>
				<SelectTrigger>
					<SelectValue placeholder={period.toUpperCase()} />
				</SelectTrigger>
				<SelectContent>
					{periodSelectItems.map(({ id, value, label }) => (
						<SelectItem key={id} value={value}>
							{label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};

export default PeriodSelect;
