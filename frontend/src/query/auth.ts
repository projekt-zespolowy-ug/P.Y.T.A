import { useMutation } from "@tanstack/react-query";
import type {
	SignInRequestBody,
	SignUpRequestBody,
} from "../types/api-requests";
import { axiosInstance } from "./http";

export const useSignUpUser = () =>
	useMutation({
		mutationFn: (data: SignUpRequestBody) => signUpUser(data),
		onMutate: () => {},
	});

const signUpUser = async (body: SignUpRequestBody) => {
	await axiosInstance.post("/auth/register", body);
};

export const useSignInUser = () =>
	useMutation({
		mutationFn: (data: SignInRequestBody) => signInUser(data),
		onMutate: () => {},
	});

const signInUser = async (body: SignInRequestBody) => {
	await axiosInstance.post("/auth/login", body);
};
