import type { Stock } from "./stocks";

export interface SignUpResponse {
	session_id: string;
}

export interface StocksResponse {
	stocks: Stock[];
	returnedCount: number;
	isLastPage: boolean;
}
