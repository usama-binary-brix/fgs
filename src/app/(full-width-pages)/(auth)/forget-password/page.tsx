import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";
import AddEmail from "./AddEmail";

export const metadata: Metadata = {
  title: "FGS Dashboard",
  description: "FGS Dashboard",
};

export default function SignIn() {
  return (
    <>
   <AddEmail/>
    </>
  )
}
