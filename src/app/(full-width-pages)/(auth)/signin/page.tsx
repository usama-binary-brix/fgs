import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FGS Dashboard",
  description: "FGS Dashboard",
};

export default function SignIn() {
  return <SignInForm />;
}
