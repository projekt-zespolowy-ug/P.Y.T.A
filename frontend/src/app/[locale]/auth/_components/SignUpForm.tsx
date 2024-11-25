"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { useTranslations } from "next-intl";

const SignUpForm = () => {
	const t = useTranslations("SignUpForm");
	// TODO: Add password regex
	const formSchema = z
		.object({
			email: z.string().email({ message: t("notAnEmailError") }),
			password: z
				.string()
				.min(7, { message: t("passwordTooShortError") })
				.max(64, { message: t("passwordTooLongError") }),

			confirmPassword: z
				.string()
				.min(7, { message: t("passwordTooShortError") })
				.max(64, { message: t("passwordTooLongError") }),
		})
		.superRefine(({ confirmPassword, password }, ctx) => {
			if (confirmPassword !== password) {
				ctx.addIssue({
					code: "custom",
					message: t("noPasswordMatchError"),
					path: ["confirmPassword"],
				});
			}
		});
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
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
									type="password"
									placeholder={t("passwordPlaceHolder")}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="confirmPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("confirmPasswordInputLabel")}</FormLabel>
							<FormControl>
								<Input
									type="password"
									placeholder={t("confirmPasswordPlaceHolder")}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">{t("registerButtonText")}</Button>
			</form>
		</Form>
	);
};

export default SignUpForm;
