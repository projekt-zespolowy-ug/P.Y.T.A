"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/routing";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

const SignInForm = () => {
	const t = useTranslations("SignInForm");
	const router = useRouter();
	const { mutate, error, isError } = useMutation({
		mutationFn: async (formData: z.infer<typeof formSchema>) => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
					credentials: "include",
				},
			);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.detail);
			}

			router.push("/");
		},
	});

	const formSchema = z.object({
		email: z.string().email({ message: t("notAnEmailError") }),
		password: z
			.string()
			.min(7, { message: t("passwordTooShortError") })
			.max(64, { message: t("passwordTooLongError") }),
	});
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		mutate(values);
	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("emailInputLabel")}</FormLabel>
							<FormControl>
								<Input placeholder={t("emailPlaceHolder")} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("passwordInputLabel")}</FormLabel>
							<FormControl>
								<Input
									placeholder={t("passwordPlaceHolder")}
									type="password"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">{t("loginButtonText")}</Button>
				{isError && (
					<Alert variant="destructive">
						<AlertDescription>{error.message}</AlertDescription>
					</Alert>
				)}
			</form>
		</Form>
	);
};

export default SignInForm;
