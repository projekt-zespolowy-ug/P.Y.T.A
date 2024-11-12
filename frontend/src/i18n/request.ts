import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
	let locale = await requestLocale;

	// biome-ignore lint: any should be here according to the docs
	if (!locale || !routing.locales.includes(locale as any)) {
		locale = routing.defaultLocale;
	}

	return {
		locale,
		messages: (await import(`../../messages/${locale}.json`)).default,
	};
});
