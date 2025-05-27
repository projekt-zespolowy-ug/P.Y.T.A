import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import Footer from "../src/app/[locale]/_components/Footer";

const messages = {
	Footer: {
		authorInfo: "",
		platform: "",
		appShortDesc: "",
		sourceCodeInfo: "",
	},
};

describe("Footer component should", () => {
	it("be rendered", () => {
		render(<Footer />, {
			wrapper: ({ children }) => (
				<NextIntlClientProvider locale="en" messages={messages}>
					{children}
				</NextIntlClientProvider>
			),
		});
		const element = screen.getByRole("contentinfo");
		expect(element).toBeDefined();
		expect(element.tagName).toBe("FOOTER");
	});
});
