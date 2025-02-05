import axios, { type AxiosInstance } from "axios";

export const axiosInstance: AxiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	withCredentials: true,
});

export const axiosServerInstance: AxiosInstance = axios.create({
	baseURL: process.env.SERVER_API_URL,
	withCredentials: true,
});
