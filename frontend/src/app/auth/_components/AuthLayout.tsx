import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

const AuthLayout = () => {
	return (
		<Tabs defaultValue="signIn" className="w-[400px]">
			<TabsList>
				<TabsTrigger value="signIn">Sign in</TabsTrigger>
				<TabsTrigger value="signUp">Sign up</TabsTrigger>
			</TabsList>
			<TabsContent value="signIn">
				<SignInForm />
			</TabsContent>
			<TabsContent value="signUp">
				<SignUpForm />
			</TabsContent>
		</Tabs>
	);
};

export default AuthLayout;
