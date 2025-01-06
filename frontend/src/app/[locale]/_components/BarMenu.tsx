"use client";
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "@/i18n/routing";
import { useGetUser } from "@/query/auth";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";
import { ModeToggle } from "./ModeToggle";

const BarMenu = () => {
	const { isSuccess: isAuthenticated } = useGetUser();
	const tLeftTabs = useTranslations("Header.LeftTabs");
	const tHeader = useTranslations("Header");
	const { resolvedTheme } = useTheme();

	return (
		<Sheet>
			<SheetTrigger>
				<Menu />
			</SheetTrigger>
			<SheetContent side="left" className="flex flex-col justify-between">
				<SheetHeader>
					<SheetTitle>
						<Image
							width={100}
							height={100}
							src={
								resolvedTheme === "dark"
									? "/static/pyta-white-simple.svg"
									: "/static/pyta-black-simple.svg"
							}
							alt={tHeader("logoAlt")}
							priority
						/>
					</SheetTitle>

					<div className="tabs flex flex-col">
						<ul className="flex flex-col list-none gap-2 text-lg text-start">
							<li className="hover:text-primary">
								<Link href="/market">{tLeftTabs("browseStocks")}</Link>
							</li>
							{isAuthenticated && (
								<li>
									<Link href="/portfolio">{tLeftTabs("portfolio")}</Link>
								</li>
							)}
						</ul>
					</div>
				</SheetHeader>
				<SheetFooter>
					<ModeToggle />
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
};

export default BarMenu;
