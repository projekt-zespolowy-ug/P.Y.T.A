export type Stock = {
	name: string;
	industry: string;
	ticker: string;
	exchange: string;
	imageUrl: string;
	buy: number;
	sell: number;
};

export interface StockPriceMessage {
	buy: number;
	sell: number;
}

export type PortfolioItem = Omit<
	Stock,
	"industry" | "exchange" | "imageUrl" | "buy" | "sell"
> & { amount: number; price: number };
