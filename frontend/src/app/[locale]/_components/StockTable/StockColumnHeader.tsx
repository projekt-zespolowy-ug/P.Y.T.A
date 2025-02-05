import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, ListRestart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSearchParamsStore } from "@/store/search-params";
import { useTranslations } from "next-intl";

interface DataTableColumnHeaderProps<TData, TValue>
	extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>;
	title: string;
}

export function StockColumnHeader<TData, TValue>({
	column,
	title,
	className,
}: DataTableColumnHeaderProps<TData, TValue>) {
	const t = useTranslations("StockTable.headers");
	if (!column.getCanSort()) {
		return <div className={cn(className)}>{title}</div>;
	}
	const paramsStore = useSearchParamsStore();

	return (
		<div className={cn("flex items-center space-x-2", className)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						className="-ml-3 h-8 data-[state=open]:bg-accent"
					>
						<span>{title}</span>
						{column.getIsSorted() === "desc" ? (
							<ArrowDown />
						) : column.getIsSorted() === "asc" ? (
							<ArrowUp />
						) : (
							<ChevronsUpDown />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuItem
						onClick={() => {
							const orderKey =
								column.id === "buy" || column.id === "sell" ? "price" : "name";
							paramsStore.setParam("order_by", orderKey);
							paramsStore.setParam("order", "asc");
							column.toggleSorting(false);
						}}
					>
						<ArrowUp className="h-3.5 w-3.5 text-muted-foreground/70" />
						{t("asc")}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							const orderKey =
								column.id === "buy" || column.id === "sell" ? "price" : "name";
							paramsStore.setParam("order_by", orderKey);
							paramsStore.setParam("order", "desc");
							column.toggleSorting(true);
						}}
					>
						<ArrowDown className="h-3.5 w-3.5 text-muted-foreground/70" />
						{t("desc")}
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => {
							paramsStore.resetSort();
							column.clearSorting();
						}}
					>
						<ListRestart className="h-3.5 w-3.5 text-muted-foreground/70" />
						{t("reset")}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
