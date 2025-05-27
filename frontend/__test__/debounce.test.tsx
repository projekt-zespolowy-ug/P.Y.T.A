import useDebounce from "@/hooks/useDebounce";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";

describe("useDebounce should", () => {
	it("debounce the value", async () => {
		const { result: stateResult } = renderHook(() => useState(1));
		const { result: debouncedResult, rerender } = renderHook(() =>
			useDebounce(stateResult.current[0], 1000),
		);

		expect(debouncedResult.current).toBe(1);

		act(() => {
			stateResult.current[1](2);
		});

		rerender();

		expect(debouncedResult.current).toBe(1);

		await waitFor(
			() => {
				expect(debouncedResult.current).toBe(2);
			},
			{ timeout: 2000 },
		);

		expect(debouncedResult.current).toBe(2);
	});
});
