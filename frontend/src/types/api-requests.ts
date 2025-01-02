export interface SignUpRequestBody {
	name: string;
	last_name: string;
	date_of_birth: string;
	email: string;
	password: string;
}

export interface SignInRequestBody {
	email: string;
	password: string;
}
