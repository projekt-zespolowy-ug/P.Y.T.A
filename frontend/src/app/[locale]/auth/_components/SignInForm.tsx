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
import { useRouter } from "@/i18n/routing";
import { useSignInUser } from "@/query/auth";
import type { AxiosError } from "axios";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { PasswordInput } from "./PasswordInput";

const SignInForm = () => {
	const t = useTranslations("AuthForm");
	const router = useRouter();
	const { mutate } = useSignInUser();

	const formSchema = z.object({
		email: z.string().email({ message: t("messages.notAnEmail") }),
		password: z.string().min(8, { message: t("messages.passwordTooShort") }),
	});
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const {
		formState: { isDirty, isValid },
	} = form;

	async function onSubmit(values: z.infer<typeof formSchema>) {
		mutate(values, {
			onSuccess: async () => {
				toast(t("messages.loginSuccess"));

				router.push("/");
			},
			onError: (e) => {
				const { status } = e as AxiosError;
				if (status === 401) {
					toast(t("messages.invalidCredentials"));
				} else if (status === 404) {
					toast(t("messages.userNotFound"));
				} else {
					toast(t("messages.serverErr"));
				}
			},
		});
	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("labels.email")}</FormLabel>
							<FormControl>
								<Input
									autoComplete="email"
									placeholder={t("placeholders.email")}
									{...field}
								/>
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
							<FormLabel>{t("labels.password")}</FormLabel>
							<FormControl>
								<PasswordInput
									autoComplete="current-password"
									placeholder={t("placeholders.password")}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button disabled={!isDirty || !isValid} type="submit">
					{t("buttons.signIn")}
				</Button>
			</form>
		</Form>
	);
};

export default SignInForm;
