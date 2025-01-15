import React from "react";
import StockDetailsLayout from "./components/StockDetailsLayout";

const Page = async ({ params }: { params: Promise<{ ticker: string }> }) => {
	const { ticker } = await params;
	return <StockDetailsLayout ticker={ticker} />;
};

export default Page;
