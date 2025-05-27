import * as routing from "@/i18n/routing";
import { axiosInstance } from "@/query/http";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { beforeAll, describe, expect, it, vi } from "vitest";
import Header from "../src/app/[locale]/_components/Header";

vi.mock("@/app/[locale]/_components/LocaleSwitcher");

describe("Header should render", () => {
	beforeAll(() => {
		vi.spyOn(routing, "useRouter").mockReturnThis();
	});

	it("avatar component when auth succeeds", async () => {
		const mockResponse = {
			data: {
				balance: 1,
				first_name: "pyta",
				last_name: "pyta",
				hashed_email: "sdfasdfs",
			},
		};
		vi.spyOn(axiosInstance, "get").mockResolvedValue(mockResponse);

		render(<Header />, {
			wrapper: ({ children }) => (
				<NextIntlClientProvider locale="en" onError={() => {}}>
					<QueryClientProvider client={new QueryClient()}>
						{children}
					</QueryClientProvider>
				</NextIntlClientProvider>
			),
		});

		await waitFor(() => {
			expect(screen.getByTestId("avatar-div")).toBeDefined();
		});
	});

	it("auth button component when auth failes", async () => {
		vi.spyOn(axiosInstance, "get").mockRejectedValue({});

		render(<Header />, {
			wrapper: ({ children }) => (
				<NextIntlClientProvider locale="en" onError={() => {}}>
					<QueryClientProvider client={new QueryClient()}>
						{children}
					</QueryClientProvider>
				</NextIntlClientProvider>
			),
		});

		await waitFor(() => {
			expect(screen.getByTestId("auth-button")).toBeDefined();
		});
	});
});
