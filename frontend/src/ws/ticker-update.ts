import type { StockSocketMessage } from "@/types/stocks";

export class StockUpdateClient {
	private socket!: WebSocket;
	private tickersEventTarget: EventTarget;

	constructor() {
		this.tickersEventTarget = new EventTarget();
		this.connect();
	}

	public connect() {
		this.socket = new WebSocket(
			`${process.env.NEXT_PUBLIC_API_URL}/stocks/updates`,
		);
		this.socket.onmessage = (event) => {
			const parsedData = JSON.parse(event.data);
			if (parsedData.type === "price_update") {
				this.tickersEventTarget.dispatchEvent(
					new CustomEvent<StockSocketMessage["tickers"]>("priceUpdate", {
						detail: parsedData.tickers,
					}),
				);
			}
		};
	}

	public disconnect() {
		this.socket.close();
	}

	public subscribe(tickers: string[]) {
		const message = {
			type: "subscribe",
			tickers,
		};
		this.socket.readyState === 1 && this.socket.send(JSON.stringify(message));
	}

	public unsubscribe(tickers: string[]) {
		const message = {
			type: "unsubscribe",
			tickers,
		};
		this.socket.readyState === 1 && this.socket.send(JSON.stringify(message));
	}

	public addPriceHandler(cb: (data: Event) => void) {
		this.tickersEventTarget.addEventListener("priceUpdate", cb);
	}

	public removePriceHandler(cb: (data: Event) => void) {
		this.tickersEventTarget.removeEventListener("priceUpdate", cb);
	}
}

export const stockUpdateClient = new StockUpdateClient();
