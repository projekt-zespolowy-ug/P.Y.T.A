import type { IndustryResponse } from "@/types/api-responses";
import camelCaseKeys from "camelcase-keys";
import { axiosServerInstance } from "./http";

export const getIndustries = async (locale = "en") => {
	return camelCaseKeys(
		(
			await axiosServerInstance.get("/industries", {
				headers: {
					Cookie: `NEXT_LOCALE=${locale}`,
				},
			})
		).data,
		{
			deep: true,
		},
	) as IndustryResponse[];
};
