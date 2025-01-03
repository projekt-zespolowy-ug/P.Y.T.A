"use client";

import { useGetUser } from "@/query/auth";
import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";

export default function UserProvider({
	children,
}: { children: React.ReactNode }) {
	const { updateUser, resetUser } = useUserStore();

	const { data, isSuccess, isError } = useGetUser();

	useEffect(() => {
		if (isSuccess) {
			updateUser(data);
		}
		if (isError) {
			resetUser();
		}
	}, [data, isSuccess, isError, updateUser, resetUser]);

	return children;
}
