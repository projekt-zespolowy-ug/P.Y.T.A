"use client";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useUserStore } from "@/store/userStore";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import BarMenu from "./BarMenu";
import LocaleSwitcher from "./LocaleSwitcher";
import UserAvatarMenu from "./UserAvatarMenu";

const Header = () => {
	const { resolvedTheme } = useTheme();
	const tHeader = useTranslations("Header");
	const logoPath =
		resolvedTheme === "light"
			? "/static/pyta-black-simple.svg"
			: "/static/pyta-white-simple.svg";

	const { isAuthenticated } = useUserStore();
	return (
		<>
			<header className="flex justify-between items-center bg-secondary">
				<div className="left">
					<div className="logo">
						<Image
							width={100}
							height={100}
							src={logoPath}
							alt={tHeader("logoAlt")}
							priority
						/>
					</div>
				</div>
				<div className="right">
					<div className="flex items-center gap-2">
						<LocaleSwitcher />
						{isAuthenticated ? (
							<div className="avatar flex flex-col items-center">
								<UserAvatarMenu />
							</div>
						) : (
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
