"use client";

import { useFormatCurrency } from "@/hooks/useFormatCurrency";
import type { Stock } from "@/types/stocks";
import type { ColumnDef } from "@tanstack/react-table";
import { StockColumnHeader } from "./StockColumnHeader";

type useColumnsProps = {
	logo: string;
	ticker: string;
	name: string;
	buy: string;
	sell: string;
};

export function useColumns({ logo, ticker, name, buy, sell }: useColumnsProps) {
	const columns: ColumnDef<Stock>[] = [
		{
			accessorKey: "imageUrl",
			header: logo,
		},
		{
			accessorKey: "ticker",
			header: ticker,
		},
		{
			accessorKey: "name",
			header: ({ column }) => (
				<StockColumnHeader column={column} title={name} />
			),
		},
		{
			accessorKey: "buy",
			header: ({ column }) => <StockColumnHeader column={column} title={buy} />,
			cell: ({ row }) => <div>{useFormatCurrency(row.original.buy)}</div>,
		},
		{
			accessorKey: "sell",
			header: ({ column }) => (
				<StockColumnHeader column={column} title={sell} />
			),
			cell: ({ row }) => <div>{useFormatCurrency(row.original.sell)}</div>,
		},
	];
	return columns;
}
