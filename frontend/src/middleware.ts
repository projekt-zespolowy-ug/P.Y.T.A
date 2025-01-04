import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { axiosInstance } from "./query/http";

const publicPages = ["", "/", "/auth", "/auth/sign-in", "/auth/sign-up"];

const intlMiddleware = createMiddleware(routing);

async function authMiddleware(req: NextRequest) {
	const sessionId = req.cookies.get("session_id")?.value;
	const [, locale] = req.nextUrl.pathname.split("/");

	if (!locale) {
		return NextResponse.redirect(
			new URL(`/${routing.defaultLocale}/auth/sign-in`, req.url),
		);
	}

	if (!sessionId) {
		return NextResponse.redirect(new URL(`/${locale}/auth/sign-in`, req.url));
	}

	try {
		await axiosInstance.get("/user/me", {
			headers: { Cookie: `session_id=${encodeURIComponent(sessionId)}` },
		});
	} catch (error) {
		console.error("Session validation failed:", error);
		return NextResponse.redirect(new URL(`/${locale}/auth/sign-in`, req.url));
	}

	return intlMiddleware(req);
}

export default async function middleware(req: NextRequest) {
	const publicPathnameRegex = RegExp(
		`^(/(${routing.locales.join("|")}))?(${publicPages.join("|")})/?$`,
		"i",
	);
	const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

	if (isPublicPage) {
		return intlMiddleware(req);
	}
	return authMiddleware(req);
}

export const config = {
	matcher: ["/", "/(pl|en)/:path*"],
};
