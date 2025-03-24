"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useSearchParamsStore } from "@/store/search-params";
import type { ExchangeResponse, IndustryResponse } from "@/types/api-responses";
import { useTranslations } from "next-intl";

type SelectIndustryProps = {
	data: IndustryResponse[] | ExchangeResponse[];
	paramKey: "industry" | "exchange";
};

function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function SelectParam({ data, paramKey }: SelectIndustryProps) {
	const paramsStore = useSearchParamsStore();
	const t = useTranslations("StockTable.selects");

	return (
		<Select
			onValueChange={(value) => {
				paramsStore.setParam(paramKey, value);
			}}
			value={paramsStore[paramKey]}
			name={paramKey}
		>
			<SelectTrigger className="w-[188px]" name={`${paramKey}Trigger`}>
				<SelectValue placeholder={capitalize(t(paramKey))} />
			</SelectTrigger>
			<SelectContent>
				{data
					.toSorted((a, b) => a.name.localeCompare(b.name))
					.map((item) => {
						return (
							<SelectItem key={item.name} value={item.name}>
								{"localeName" in item ? item.localeName : item.name}
							</SelectItem>
						);
					})}
			</SelectContent>
		</Select>
	);
}
