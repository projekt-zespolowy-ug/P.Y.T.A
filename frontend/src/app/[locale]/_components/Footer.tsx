import { createId } from "@paralleldrive/cuid2";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";
import PytaLogo from "./PytaLogo";

const Footer = () => {
	const t = useTranslations("Footer");
	const authors = [
		"Mateusz Kurowski",
		"Stanisław Olszewski",
		"Maciej Marszałkowski",
		"Mikołaj Malek",
	].sort((a, b) => a.localeCompare(b));

	return (
		<footer className="bg-secondary flex flex-col lg:flex-row justify-between px-8 py-4">
			<div className="w-full lg:w-1/3">
				<PytaLogo className="w-24 h-8 fill-primary" />
				<div className="footerInfo text-muted text-sm my-2">
					{t("appShortDesc")}
				</div>
				<div>
					{t("sourceCodeInfo")}
					<a
						href="https://github.com/projekt-zespolowy-ug/P.Y.T.A/"
						target="_blank"
						rel="noreferrer"
						className="text-primary font-bold"
					>
						{" "}
						{t("platform")}
					</a>
				</div>
			</div>
			<div className="w-full mt-4 lg:mt-0 lg:w-1/3">
				<span className="authorInfo font-bold text-lg">{t("authorInfo")}</span>
				<div className="authors flex flex-row justify-evenly mt-2">
					<ul className="authors-list list-none flex flex-col w-full text-muted">
						{authors.map((author) => (
							<li key={createId()}>{author}</li>
						))}
					</ul>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
