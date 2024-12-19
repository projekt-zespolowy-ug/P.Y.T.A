import { useMutation } from "@tanstack/react-query";
import type { ISignupRequestBody } from "../types/api-requests";
import { axiosInstance } from "./http";

export const useSignupUser = () =>
	useMutation({
		mutationFn: (data: ISignupRequestBody) => signUpUser(data),
		onMutate: () => {},
	});

const signUpUser = async (body: ISignupRequestBody) => {
	await axiosInstance.post("/auth/register", body);
};
