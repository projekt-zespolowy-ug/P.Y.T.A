"use client";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

const MyTooltip = ({
	children,
	tooltipContent,
}: PropsWithChildren<{  tooltipContent: React.ReactNode }>) => (
	<TooltipProvider>
		<Tooltip>
			<TooltipTrigger asChild>{children}</TooltipTrigger>
			<TooltipContent>{tooltipContent}</TooltipContent>
		</Tooltip>
	</TooltipProvider>
);

export default MyTooltip;
