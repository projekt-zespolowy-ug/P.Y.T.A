import { renderHook } from "@testing-library/react";
import { useLocale } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import { useFormatCurrency } from "../src/hooks/useFormatCurrency";

vi.mock("next-intl", () => ({
	useLocale: vi.fn(),
}));

describe("useFormatCurrency should", () => {
	it("return price in polish locale", () => {
		vi.mocked(useLocale).mockReturnValue("pl");
		const { result } = renderHook(() => useFormatCurrency(1));

		expect(result.current.slice(-2)).toBe("zł");
	});

	it("return price in english locale", () => {
		vi.mocked(useLocale).mockReturnValue("en");
		const { result } = renderHook(() => useFormatCurrency(1));

		expect(result.current[0]).toBe("$");
	});
});
