"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

const AuthLayout = () => {
   const t = useTranslations("AuthPage");
   return (
      <Tabs defaultValue="signIn" className="w-[400px]">
         <TabsList>
            <TabsTrigger value="signIn">{t("signIn")}</TabsTrigger>
            <div>1</div>
            <TabsTrigger value="signUp">{t("signUp")}</TabsTrigger>
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
