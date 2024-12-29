import { createId } from "@paralleldrive/cuid2";
import { useTranslations } from "next-intl";
import React from "react";

const Footer = () => {
	const t = useTranslations("Footer");
	const authors = [
		"Mateusz Kurowski",
		"Stanisław Olszewski",
		"Maciej Marszałkowski",
		"Mikołaj Malek",
	].sort((a, b) => a.localeCompare(b));

	return (
		<footer className="bg-secondary py-2 flex flex-col">
			<span className="authorInfo text-center font-bold">
				{t("authorInfo")}
			</span>
			<div className="authors flex flex-row justify-evenly">
				<ul className="authors-list list-none flex flex-row w-full">
					{authors.map((author) => (
						<div key={createId()}>
							<li className="text-center">{author}</li>
						</div>
					))}
				</ul>
			</div>
		</footer>
	);
};

export default Footer;
