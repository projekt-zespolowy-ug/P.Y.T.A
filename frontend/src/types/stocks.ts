export type Stock = {
	name: string;
	industry: string;
	ticker: string;
	exchange: string;
	imageUrl: string;
	buy: number;
	sell: number;
};

export interface StockSocketMessage {
	type: "subscribe" | "unsubscribe" | "price_update";
	tickers: Record<string, { buy: number; sell: number }>;
}

export type PortfolioItem = Omit<
	Stock,
	"industry" | "exchange" | "imageUrl" | "buy" | "sell"
> & { amount: number; price: number };

export enum TimeUnit {
	SECOND = "s",
	MINUTE = "min",
	HOUR = "h",
	DAY = "d",
	MONTH = "mth",
	YEAR = "y",
}

export enum PeriodUnit {
	ONE_YEAR = "1y",
	THREE_YEARS = "3y",
	FIVE_YEARS = "5y",
	ONE_DAY = "1d",
	THREE_DAYS = "3d",
	SEVEN_DAYS = "7d",
}
