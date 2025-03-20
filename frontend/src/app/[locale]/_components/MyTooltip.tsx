"use client";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { PropsWithChildren, ReactNode } from "react";

const MyTooltip = ({
	children,
	tooltipContent,
}: PropsWithChildren<{ tooltipContent: ReactNode }>) => (
	<TooltipProvider>
		<Tooltip>
			<TooltipTrigger asChild>{children}</TooltipTrigger>
			<TooltipContent>{tooltipContent}</TooltipContent>
		</Tooltip>
	</TooltipProvider>
);

export default MyTooltip;
