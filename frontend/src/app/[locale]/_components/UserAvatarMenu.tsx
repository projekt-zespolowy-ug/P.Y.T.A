"use client";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/store/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useLocale, useTranslations } from "next-intl";

const UserAvatarMenu = () => {
	const { name, balance } = useUserStore();
	const locale = useLocale();
	const currencyLocale = locale === "pl" ? "pl-PL" : "en-EN";
	const currency = locale === "pl" ? "PLN" : "USD";
	const formattedBalance = new Intl.NumberFormat(currencyLocale, {
		style: "currency",
		currency,
	}).format(balance);

	const t = useTranslations("Header.RightTabs.Avatar");
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="rounded-full">
				<Avatar>
					<AvatarImage
						className="w-[3rem] h-[3rem] rounded-full"
						// TODO: use dicebear image from hash from store
						src="https://github.com/shadcn.png"
					/>
					<AvatarFallback>
						<Skeleton className="w-[3rem] h-[3rem] rounded-full" />
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem className="text-md text-green-700">
					{formattedBalance}
				</DropdownMenuItem>
				<DropdownMenuItem className="text-md italic font">
					{name}
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem>{t("profile")}</DropdownMenuItem>
				<DropdownMenuItem>
					<Button>{t("signOut")}</Button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserAvatarMenu;
