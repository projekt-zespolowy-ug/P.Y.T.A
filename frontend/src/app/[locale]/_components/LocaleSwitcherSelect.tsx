"use client";

import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePathname, useRouter } from "@/i18n/routing";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { type ReactNode, useTransition } from "react";

type Props = {
	children: ReactNode;
	defaultValue: string;
};

export default function LocaleSwitcherSelect({
	children,
	defaultValue,
}: Props) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const pathname = usePathname();
	const params = useParams();

	function onSelectChange(newLocale: string) {
		startTransition(() => {
			// @ts-expect-error -- TypeScript will validate that only known `params`
			// are used in combination with a given `pathname`. Since the two will
			// always match for the current route, we can skip runtime checks.
			router.push({ pathname, params }, { locale: newLocale });
		});
	}

	return (
		<div
			className={clsx(
				"relative text-gray-400",
				isPending && "transition-opacity [&:disabled]:opacity-30",
			)}
		>
			<Select
				onValueChange={onSelectChange}
				name="localeSwitcher"
				value={defaultValue}
			>
				<SelectTrigger
					className="focus:ring-0 focus:ring-offset-0"
					name="localeSwitcherTrigger"
				>
					<SelectValue />
				</SelectTrigger>
				{children}
			</Select>
		</div>
	);
}
