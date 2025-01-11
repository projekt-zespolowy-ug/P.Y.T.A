export function getTickerPrices(
	ticker: string,
	onMessage: (event: MessageEvent) => void,
) {
	const socket = new WebSocket(
		`${process.env.NEXT_PUBLIC_API_URL}/stocks/updates/${ticker}`,
	);

	socket.onmessage = onMessage;

	return socket;
}
