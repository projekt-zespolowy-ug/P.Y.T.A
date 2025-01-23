import { useLocale } from "next-intl";

const exchangeRates = {
	USD: 1,
	PLN: 3.8,
};

export function useFormatCurrency(value: number) {
	const locale = useLocale();
	const currencyLocale = locale === "pl" ? "pl-PL" : "en-EN";
	const currency = locale === "pl" ? "PLN" : "USD";
	return new Intl.NumberFormat(currencyLocale, {
		style: "currency",
		currency,
	}).format(value * exchangeRates[currency]);
}

export function getFormatCurrencyString(value: number, locale: string): string {
	const currencyLocale = locale === "pl" ? "pl-PL" : "en-EN";
	const currency = locale === "pl" ? "PLN" : "USD";
	const priceString = new Intl.NumberFormat(currencyLocale, {
		style: "currency",
		currency,
	}).format(value);
	return priceString;
}

export function getFormatCurrency(value: number, locale: string): number {
	const currency = locale === "pl" ? "PLN" : "USD";
	return value * exchangeRates[currency];
}
