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
}: { children: JSX.Element; tooltipContent: JSX.Element }) => (
	<TooltipProvider>
		<Tooltip>
			<TooltipTrigger asChild>{children}</TooltipTrigger>
			<TooltipContent>{tooltipContent}</TooltipContent>
		</Tooltip>
	</TooltipProvider>
);

export default MyTooltip;
