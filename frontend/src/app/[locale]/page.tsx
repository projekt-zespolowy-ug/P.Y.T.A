import { getExchanges } from "@/query/exchange";
import { getIndustries } from "@/query/industry";
import { getLocale } from "next-intl/server";
import HomePageLayout from "./_components/HomePageLayout";
import SelectParam from "./_components/SelectParam";

export default async function Home() {
	const locale = await getLocale();
	const industries = await getIndustries(locale);
	const exchanges = await getExchanges();

	return (
		<HomePageLayout>
			<SelectParam paramKey="industry" data={industries} />
			<SelectParam paramKey="exchange" data={exchanges} />
		</HomePageLayout>
	);
}
