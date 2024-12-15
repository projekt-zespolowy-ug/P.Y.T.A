import { routing } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";

const LocaleSwitcher = () => {
	const t = useTranslations("Header.RightTabs.LocaleSwitcher");
	const locale = useLocale();

	return (
		<LocaleSwitcherSelect defaultValue={locale} label={t("label")}>
			{routing.locales.map((cur) => (
				<option key={cur} value={cur}>
					{t("locale", { locale: cur })}
				</option>
			))}
		</LocaleSwitcherSelect>
	);
};

export default LocaleSwitcher;
