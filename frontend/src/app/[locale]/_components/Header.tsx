"use client";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import LocaleSwitcher from "./LocaleSwitcher";
import { ModeToggle } from "./ModeToggle";
import UserAvatarMenu from "./UserAvatarMenu";

const Header = () => {
	const { resolvedTheme } = useTheme();
	const tHeader = useTranslations("Header");
	const tLeftTabs = useTranslations("Header.LeftTabs");
	const locale = useLocale();
	// TODO: TAKE THIS VALUE FROM AUTH.JS API
	const loggedIn = true;
	return (
		<header className="flex justify-between items-center bg-secondary">
			<div className="left">
				<div className="logo">
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
				</div>
				<div className="tabs flex">
					<ul className="flex list-none gap-2">
						<li>
							<Link href={`${locale}/market`}>{tLeftTabs("browseStocks")}</Link>
						</li>
						<li>
							<Link href={`${locale}/portfolio`}>{tLeftTabs("portfolio")}</Link>
						</li>
					</ul>
				</div>
			</div>
			<div className="right">
				{loggedIn ? (
					<div className="flex items-center gap-2">
						<LocaleSwitcher />
						<ModeToggle />
						<div className="avatar flex flex-col items-center">
							<UserAvatarMenu />
						</div>
					</div>
				) : (
					<Button>{tHeader("signIn")}</Button>
				)}
			</div>
		</header>
	);
};

export default Header;
