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
