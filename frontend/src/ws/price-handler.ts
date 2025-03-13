import type { StockSocketMessage } from "@/types/stocks";

export function createPriceHandler(
	ticker: string,
	cb: (event: CustomEvent<StockSocketMessage["tickers"]>) => void,
) {
	return (event: Event) => {
		const customEvent = event as CustomEvent<StockSocketMessage["tickers"]>;
		if (customEvent.detail[ticker]) {
			cb(customEvent);
		}
	};
}
