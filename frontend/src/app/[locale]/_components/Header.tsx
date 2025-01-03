"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useUserStore } from "@/store/userStore";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";
import BarMenu from "./BarMenu";
import LocaleSwitcher from "./LocaleSwitcher";
import PytaLogo from "./PytaLogo";
import UserAvatarMenu from "./UserAvatarMenu";

const Header = () => {
	const tHeader = useTranslations("Header");

	const { isAuthenticated } = useUserStore();
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
