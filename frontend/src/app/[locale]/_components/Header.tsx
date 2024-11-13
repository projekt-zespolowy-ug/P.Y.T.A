"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";
import { ModeToggle } from "./ModeToggle";

const Header = () => {
	const t = useTranslations("Header");
	return (
		<header className="flex justify-between">
			<div className="logo">
				<Image
					width={200}
					height={200}
					src="/pyta-logo.png"
					alt={t("logoAlt")}
					priority
				/>
			</div>
			<div className="right">
				<ModeToggle />
			</div>
		</header>
	);
};

export default Header;
