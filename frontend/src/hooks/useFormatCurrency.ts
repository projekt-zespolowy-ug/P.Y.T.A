import { useLocale } from "next-intl";

export function useFormatCurrency(value: number) {
	// lets hardcode exchange rates for now, later we can fetch them from some API
	const exchangeRates = {
		USD: 1,
		PLN: 3.8,
	};
	const locale = useLocale();
	const currencyLocale = locale === "pl" ? "pl-PL" : "en-EN";
	const currency = locale === "pl" ? "PLN" : "USD";
	return new Intl.NumberFormat(currencyLocale, {
		style: "currency",
		currency,
	}).format(value * exchangeRates[currency]);
}
