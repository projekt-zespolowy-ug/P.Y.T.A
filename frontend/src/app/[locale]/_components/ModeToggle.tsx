"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
export function ModeToggle() {
	const { setTheme } = useTheme();
	const t = useTranslations("ModeToggler");
	return (
		<DropdownMenu>
			<DropdownMenuTrigger name={"theme-select-trigger"} asChild>
				<Button variant="outline" size="icon">
					<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">t('changeMode')</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem
					data-test-id={"light-switch"}
					onClick={() => setTheme("light")}
				>
					{t("light")}
				</DropdownMenuItem>
				<DropdownMenuItem
					data-test-id={"dark-switch"}
					onClick={() => setTheme("dark")}
				>
					{t("dark")}
				</DropdownMenuItem>
				<DropdownMenuItem
					data-test-id={"system-switch"}
					onClick={() => setTheme("system")}
				>
					{t("system")}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
