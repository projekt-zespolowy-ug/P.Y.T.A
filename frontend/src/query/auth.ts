import { useMutation } from "@tanstack/react-query";
import type { SignupRequestBody } from "../types/api-requests";
import { axiosInstance } from "./http";

export const useSignupUser = () =>
	useMutation({
		mutationFn: (data: SignupRequestBody) => signUpUser(data),
		onMutate: () => {},
	});

const signUpUser = async (body: SignupRequestBody) => {
	await axiosInstance.post("/auth/register", body);
};
