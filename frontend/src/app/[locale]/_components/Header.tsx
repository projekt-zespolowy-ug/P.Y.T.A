"use client";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import LocaleSwitcher from "./LocaleSwitcher";
import { ModeToggle } from "./ModeToggle";
import UserAvatarMenu from "./UserAvatarMenu";

const Header = () => {
	const { resolvedTheme } = useTheme();
	const tHeader = useTranslations("Header");
	const tLeftTabs = useTranslations("Header.LeftTabs");
	const currentPath = usePathname();
	// TODO: TAKE THIS VALUE FROM AUTH.JS API
	const loggedIn = true;
	return (
		<header className="flex justify-between bg-secondary">
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
							<Link href={`${currentPath}/market`}>
								{tLeftTabs("browseStocks")}
							</Link>
						</li>
						<li>
							<Link href={`${currentPath}/portfolio`}>
								{tLeftTabs("portfolio")}
							</Link>
						</li>
					</ul>
				</div>
			</div>
			<div className="right">
				{loggedIn ? (
					<div className="flex">
						<LocaleSwitcher />
						<ModeToggle />
						<div className="avatar flex flex-col">
							<UserAvatarMenu />
							UserName
						</div>
					</div>
				) : (
					<Button>Sign In</Button>
				)}
			</div>
		</header>
	);
};

export default Header;
