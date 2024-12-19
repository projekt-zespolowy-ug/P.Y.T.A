"use client";
import { usePathname, useRouter } from "@/i18n/routing";
import React, { useEffect } from "react";
import SignInForm from "./_components/SignInForm";

const Page = () => {
	const router = useRouter();
	const path = usePathname();

	useEffect(() => {
		if (path === "/auth") {
			router.push("/auth/sign-in");
		}
	}, [path, router]); // Dependencies to ensure useEffect runs on path change

	return <SignInForm />;
};

export default Page;
