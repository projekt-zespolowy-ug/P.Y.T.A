import { useQuery } from "@tanstack/react-query";
import type { PortfolioItem } from "../types/stocks";
import { axiosInstance } from "./http";

export const useGetPortfolio = () =>
	useQuery({
		queryKey: ["portfolio"],
		queryFn: () => getPortfolio(),
	});

const getPortfolio = async () =>
	(await axiosInstance.get("/user/portfolio")).data as PortfolioItem[];
