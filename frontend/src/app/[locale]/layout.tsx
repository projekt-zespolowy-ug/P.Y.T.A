import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import Header from "./_components/Header";
import QueryProvider from "./_components/QueryProvider";
import { ThemeProvider } from "./_components/theme-provider";

const geistSans = localFont({
	src: "../fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "../fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "P.Y.T.A.",
	description: "Profit - Your Trading App",
};

export default async function LocaleLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;

	// biome-ignore lint: any should be here according to the docs
	if (!routing.locales.includes(locale as any)) {
		notFound();
	}

	const messages = await getMessages();

	return (
		<html lang={locale} suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<NextIntlClientProvider messages={messages}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<QueryProvider>
							<Header />
							{children}
						</QueryProvider>
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
