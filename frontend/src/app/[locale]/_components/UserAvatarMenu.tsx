"use client";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useTranslations } from "next-intl";

const UserAvatarMenu = () => {
	const t = useTranslations("Header.RightTabs.Avatar");
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="rounded-full">
				<Avatar>
					<AvatarImage
						className="w-[3rem] h-[3rem] rounded-full"
						src="https://github.com/shadcn.png"
					/>
					<AvatarFallback>
						<Skeleton className="w-[3rem] h-[3rem] rounded-full" />
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem>{t("profile")}</DropdownMenuItem>
				<DropdownMenuItem>
					<Button>{t("signOut")}</Button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserAvatarMenu;
