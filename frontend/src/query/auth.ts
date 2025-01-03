import type { User } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
	SignInRequestBody,
	SignUpRequestBody,
} from "../types/api-requests";
import { axiosInstance } from "./http";

export const useSignUpUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: SignUpRequestBody) => signUpUser(data),
		onMutate: () => {},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
	});
};

const signUpUser = async (body: SignUpRequestBody) => {
	await axiosInstance.post("/auth/register", body);
};

export const useSignInUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: SignInRequestBody) => signInUser(data),
		onMutate: () => {},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
	});
};

const signInUser = async (body: SignInRequestBody) => {
	await axiosInstance.post("/auth/login", body);
};

export const useSignOutUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: signOutUser,
		onMutate: () => {},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
	});
};

const signOutUser = async () => {
	await axiosInstance.post("/auth/logout");
};

export const useGetUser = () =>
	useQuery({
		queryKey: ["user"],
		queryFn: getUser,
		retry: false,
	});

const getUser = async () => {
	const res = await axiosInstance.get("/user/me");

	return {
		balance: res.data.balance,
		firstName: res.data.first_name,
		lastName: res.data.last_name,
		hashedEmail: res.data.hashed_email,
		isAuthenticated: true,
	} as User;
};
