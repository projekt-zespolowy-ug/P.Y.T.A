import { SelectContent, SelectItem } from "@/components/ui/select";
import { useLocale, useTranslations } from "next-intl";

import { routing } from "@/i18n/routing";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";

const LocaleSwitcher = () => {
	const t = useTranslations("Header.RightTabs.LocaleSwitcher");
	const locale = useLocale();

	const localeNames: Map<string, string> = new Map([
		["en", "English"],
		["pl", "Polski"],
	]);

	const getLocaleNameFull = (cur: string) => {
		return `${t("locale", { locale: cur })} ${localeNames.get(cur) || "unknown"}`;
	};

	return (
		<LocaleSwitcherSelect defaultValue={locale}>
			<SelectContent>
				{routing.locales.map((cur) => (
					<SelectItem
						className="bg-primary-foreground [&:not(:last-child)]:rounded-b-none [&:not(:first-child)]:rounded-t-none"
						key={cur}
						value={cur}
					>
						{getLocaleNameFull(cur)}
					</SelectItem>
				))}
			</SelectContent>
		</LocaleSwitcherSelect>
	);
};

export default LocaleSwitcher;
