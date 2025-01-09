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
import { useFormatCurrency } from "@/hooks/useFormatCurrency";
import { useRouter } from "@/i18n/routing";
import { useSignOutUser } from "@/query/auth";
import type { User } from "@/types/user";
import { avataaars } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

type Props = {
	user: User;
};

const UserAvatarMenu = ({ user }: Props) => {
	const { mutate } = useSignOutUser();
	const router = useRouter();
	const t = useTranslations("Header");
	const formattedBalance = useFormatCurrency(user.balance);

	const avatarUri = createAvatar(avataaars, {
		seed: user.hashedEmail,
	}).toDataUri();

	function handleSignOut() {
		mutate(undefined, {
			onSuccess: () => {
				toast(t("messages.signOutSuccess"));

				router.push("/");
			},
			onError: () => {
				toast(t("messages.signOutError"));
			},
		});
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="rounded-full">
				<Avatar>
					<AvatarImage
						className="w-[3rem] h-[3rem] rounded-full"
						src={avatarUri}
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
					{user.firstName}
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem>{t("RightTabs.Avatar.profile")}</DropdownMenuItem>
				<DropdownMenuItem>
					<Button onClick={handleSignOut}>
						{t("RightTabs.Avatar.signOut")}
					</Button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserAvatarMenu;
