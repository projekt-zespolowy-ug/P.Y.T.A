"use client";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
	const t = useTranslations("AuthPage");
	const pathname = usePathname();
	const locale = useLocale();

	const activeTab =
		pathname === `/${locale}/auth/sign-up` ? "signUp" : "signIn";

	return (
		<div className="flex items-center justify-center h-svh">
			<div className="w-[400px] mx-2">
				<div className="flex border-b border-gray-200 mb-4">
					{/* Links replacing Tabs */}
					<Link
						href={`/${locale}/auth/sign-in`}
						className={`px-4 py-2 ${
							activeTab === "signIn"
								? "text-blue-600 border-b-2 border-blue-600"
								: "text-gray-600"
						}`}
					>
						{t("signIn")}
					</Link>
					<Link
						href={`/${locale}/auth/sign-up`}
						className={`px-4 py-2 ${
							activeTab === "signUp"
								? "text-blue-600 border-b-2 border-blue-600"
								: "text-gray-600"
						}`}
					>
						{t("signUp")}
					</Link>
				</div>
				{children}
			</div>
		</div>
	);
};

export default Layout;
