"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
	children,
	...props
}: React.ComponentProps<typeof NextThemesProvider>) {
	// This might be necessary later...
	// For now the hydrationError was resolved by serving
	// the same svg no matter the theme and coloring using tailwind

	// const [mounted, setMounted] = useState(false);

	// useEffect(() => {
	// 	setMounted(true);
	// }, []);

	// if (!mounted) return null;

	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
