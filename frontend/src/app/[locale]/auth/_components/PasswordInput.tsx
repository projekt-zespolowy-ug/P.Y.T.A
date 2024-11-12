"use client";

import { Input } from "@/components/ui/input";
import { useAuthFormStore } from "../utils/loginState";
import type { ControllerFieldState, FieldValues } from "react-hook-form";
import PrivacyToggler from "./PrivacyToggler";
import { useState } from "react";

interface PasswordInputProps<T extends FieldValues> {
	placeholder: string;
	field: ControllerFieldState;
	fieldName: keyof T;
}

const PasswordInput = <T extends FieldValues>({
	placeholder,
	field,
	fieldName,
}: PasswordInputProps<T>) => {
	const updateFormState = useAuthFormStore((state) => state.updateFormState);
	const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

	return (
		<div>
			<Input
				type={passwordVisible ? "text" : "password"}
				placeholder={placeholder}
				{...field}
				onChangeCapture={(e) =>
					updateFormState({
						[fieldName]: (e.target as HTMLInputElement).value,
					})
				}
			/>
			<PrivacyToggler
				passwordVisible={passwordVisible}
				toggleVisibility={() => setPasswordVisible(!passwordVisible)}
			/>
		</div>
	);
};

export default PasswordInput;
