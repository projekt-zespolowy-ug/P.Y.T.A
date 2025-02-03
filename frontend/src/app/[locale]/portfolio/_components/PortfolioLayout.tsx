"use client";
import { useGetPortfolio } from "@/query/portfolio";
import cuid2 from "@paralleldrive/cuid2";
import { useTranslations } from "next-intl";
import React from "react";
import { Spinner } from "../../_components/Spinner";
import OwnedStock from "./OwnedStock";

const PortfolioLayout = () => {
	const { data, isLoading, error } = useGetPortfolio();

	const t = useTranslations("StockDetails");

	if (isLoading || !data) return <Spinner />;
	if (error) return error.message;

	return (
		<div className="m-2">
			<div className="text-center">
				<h1>{t("myAssets")}</h1>
			</div>
			<div className="flex flex-col gap-2">
				{data.map((item) => (
					<OwnedStock item={item} key={cuid2.createId()} />
				))}
			</div>
		</div>
	);
};

export default PortfolioLayout;
