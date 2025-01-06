"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/routing";
import { useGetUser } from "@/query/auth";
import { useTranslations } from "next-intl";
import BarMenu from "./BarMenu";
import LocaleSwitcher from "./LocaleSwitcher";
import PytaLogo from "./PytaLogo";
import UserAvatarMenu from "./UserAvatarMenu";

const Header = () => {
	const tHeader = useTranslations("Header");

	const {
		isSuccess: isAuthenticated,
		isError,
		isLoading,
		data: user,
	} = useGetUser();

	return (
		<>
			<header className="flex justify-between items-center bg-secondary">
				<div className="left">
					<div className="logo p-4">
						<PytaLogo className="w-24 h-8 fill-primary" />
					</div>
				</div>
				<div className="right">
					<div className="flex items-center gap-2 mr-2">
						<LocaleSwitcher />
						{isLoading && (
							<Skeleton className="w-[3rem] h-[3rem] rounded-full" />
						)}
						{isAuthenticated && (
							<div className="avatar flex flex-col items-center">
								<UserAvatarMenu user={user} />
							</div>
						)}
						{isError && (
							<Link href={"/auth/sign-in"}>
								<Button>{tHeader("RightTabs.signIn")}</Button>
							</Link>
						)}
						<BarMenu />
					</div>
				</div>
			</header>
		</>
	);
};

export default Header;
