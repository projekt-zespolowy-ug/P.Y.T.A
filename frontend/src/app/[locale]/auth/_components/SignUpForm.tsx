"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { passwordRegex } from "@/lib/regex";
import { useSignupUser } from "@/query/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import moment from "moment";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { DatePicker } from "./DatePicker";
import { PasswordInput } from "./PasswordInput";

const SignUpForm = () => {
	const t = useTranslations("SignUpForm");
	const router = useRouter();
	const minBirthDate = new Date();
	const minAge = 18;
	const maxAge = 140;

	// Calculate the minBirthDate (18 years ago)
	minBirthDate.setFullYear(minBirthDate.getFullYear() - minAge);

	// Calculate the maxBirthDate (140 years ago)
	const maxBirthDate = new Date();
	maxBirthDate.setFullYear(maxBirthDate.getFullYear() - maxAge);

	const registerFormSchema = z
		.object({
			email: z.string().email({ message: t("messages.notAnEmail") }),
			name: z
				.string()
				.min(1, t("messages.required", { field: t("fields.name") }))
				.max(29, t("messages.tooLong", { field: t("fields.name") })),
			lastName: z
				.string()
				.min(1, t("messages.required", { field: t("fields.lastName") }))
				.max(29, t("messages.tooLong", { field: t("fields.lastName") })),
			dateOfBirth: z
				.date()
				.min(maxBirthDate, t("messages.tooOld"))
				.max(minBirthDate, t("messages.tooYoung"))
				.transform((val) => moment(val).format("YYYY-MM-DD").toString()),
			password: z
				.string()
				.min(8, {
					message: t("messages.required", { field: t("fields.password") }),
				})
				.regex(passwordRegex, t("messages.weakPassword")),
			confirmPassword: z.string(),
			termsChecked: z.boolean().refine((val) => val, {
				message: t("messages.required", { field: t("messages.acceptTerms") }),
			}),
		})
		.superRefine(({ confirmPassword, password }, ctx) => {
			if (confirmPassword !== password) {
				ctx.addIssue({
					code: "custom",
					message: t("messages.noPasswordMatchError"),
					path: ["confirmPassword"],
				});
			}
		});
	const form = useForm<z.infer<typeof registerFormSchema>>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
			lastName: "",
			name: "",
			dateOfBirth: "",
			termsChecked: false,
		},
	});
	const {
		formState: { isDirty, isValid },
	} = form;

	const signUpUser = useSignupUser();

	const onSubmit = async (values: z.infer<typeof registerFormSchema>) => {
		const {
			dateOfBirth: date_of_birth,
			email,
			lastName: last_name,
			name,
			password,
		} = values;
		try {
			signUpUser.mutate(
				{ date_of_birth, email, last_name, name, password },
				{
					onSuccess: async () => {
						toast(t("messages.registerSuccess"));
						await setTimeout(() => {
							router.push("/auth/sign-in");
						}, 2000);
					},
					onError: (e) => {
						const { status } = e as AxiosError;
						if (status === 400) {
							toast(t("messages.alreadyExists"));
						} else if (status === 422) {
							toast(t("messages.validationErr"));
						} else {
							toast(t("messages.serverErr"));
						}
					},
				},
			);
		} catch (e) {}
	};

	return (
		<FormProvider {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<>
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
					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("labels.confirmPassword")}</FormLabel>
								<FormControl>
									<PasswordInput
										autoComplete="current-password"
										placeholder={t("placeholders.confirmPassword")}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("labels.name")}</FormLabel>
								<FormControl>
									<Input
										autoComplete="name"
										placeholder={t("placeholders.name")}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="lastName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("labels.lastName")}</FormLabel>
								<FormControl>
									<Input
										autoComplete="family-name"
										placeholder={t("placeholders.lastName")}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<DatePicker fromDate={maxBirthDate} toDate={minBirthDate} />
					<FormField
						control={form.control}
						name="termsChecked"
						render={({ field }) => (
							<FormItem className="flex gap-2 items-center">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
								<FormLabel className="text-md">{t("labels.terms")}</FormLabel>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="control-buttons flex justify-between">
						<Button disabled={!isDirty || !isValid} type="submit">
							{t("registerButton")}
						</Button>
					</div>
				</>
			</form>
		</FormProvider>
	);
};

export default SignUpForm;
