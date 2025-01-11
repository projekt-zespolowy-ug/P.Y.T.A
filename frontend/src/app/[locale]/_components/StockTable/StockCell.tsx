"use client";
import { TableCell } from "@/components/ui/table";
import type { Stock } from "@/types/stocks";
import { type Cell, flexRender } from "@tanstack/react-table";
import Image from "next/image";

type StockCellProps<TValue> = {
	cell: Cell<Stock, TValue>;
};

export default function StockCell<TValue>({ cell }: StockCellProps<TValue>) {
	return (
		<TableCell
			key={cell.id}
			className={
				cell.column.id === "buy"
					? "text-green-600"
					: cell.column.id === "sell"
						? "text-red-600"
						: ""
			}
		>
			{cell.column.id === "imageUrl" ? (
				<Image
					src={cell.getValue<string>()}
					alt={cell.row.getValue("name")}
					width={40}
					height={40}
				/>
			) : (
				flexRender(cell.column.columnDef.cell, cell.getContext())
			)}
		</TableCell>
	);
}
