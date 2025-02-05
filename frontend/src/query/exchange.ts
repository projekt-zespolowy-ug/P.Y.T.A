import type { ExchangeResponse } from "@/types/api-responses";
import camelCaseKeys from "camelcase-keys";
import { axiosServerInstance } from "./http";

export const getExchanges = async () => {
	return camelCaseKeys((await axiosServerInstance.get("/exchanges")).data, {
		deep: true,
	}) as ExchangeResponse[];
};
