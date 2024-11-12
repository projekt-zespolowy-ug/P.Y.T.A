import { create } from "zustand";

interface IFormValues {
	email: string;
	password: string;
	passwordConfirmation?: string;
}

interface IFormState {
	formState: IFormValues;
	updateFormState: (update: Partial<IFormValues>) => void;
}

export type TAuthFormUpdate = Partial<IFormValues>;

export const useAuthFormStore = create<IFormState>((set) => ({
	formState: {
		email: "",
		password: "",
		passwordConfirmation: "",
	},
	updateFormState: (update) =>
		set((state) => ({ formState: { ...state.formState, ...update } })),
}));
