import type { Stock } from "./stocks";

export interface SignUpResponse {
	session_id: string;
}

export interface StocksResponse {
	stocks: Stock[];
	returnedCount: number;
	isLastPage: boolean;
}

type NameProp = { name: string };
type ExchangeInfo = {
	time_open: string;
	time_close: string;
	currency: string;
} & NameProp;

export type GetStockDetailsResponse = {
	description: string;
	ticker: string;
	industry: NameProp;
	exchange: ExchangeInfo;
} & NameProp;

export interface StockHistory {
	timestamp: string;
	min: number;
	max: number;
	open: number;
	close: number;
}
