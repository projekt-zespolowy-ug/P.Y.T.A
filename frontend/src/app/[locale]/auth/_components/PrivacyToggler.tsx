import { Eye, EyeClosed } from "lucide-react";
import React from "react";

const PrivacyToggler = ({
	passwordVisible,
	toggleVisibility,
}: {
	passwordVisible: boolean;
	toggleVisibility: () => void;
}) => {
	return (
		<button type="button" onClick={toggleVisibility}>
			{passwordVisible ? <Eye /> : <EyeClosed />}
		</button>
	);
};

export default PrivacyToggler;
