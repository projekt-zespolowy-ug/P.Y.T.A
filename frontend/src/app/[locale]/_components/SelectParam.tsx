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

type SelectIndustryProps = {
	data: IndustryResponse[] | ExchangeResponse[];
	paramKey: "industry" | "exchange";
};

export default function SelectParam({ data, paramKey }: SelectIndustryProps) {
	const paramsStore = useSearchParamsStore();

	return (
		<Select
			onValueChange={(value) => {
				paramsStore.setParam(paramKey, value);
			}}
			value={paramsStore[paramKey]}
		>
			<SelectTrigger className="w-[188px]">
				<SelectValue
					placeholder={paramKey.charAt(0).toUpperCase() + paramKey.slice(1)}
				/>
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
