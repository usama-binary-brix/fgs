// "use client";

// import SignInForm from "@/components/auth/SignInForm";
// export default function LoginPage() {


//   return (
  
//     <>
//     <SignInForm/>
    
//     </>
//   );
// }

import { redirect } from "next/navigation";

export default function LoginPage() {
  redirect("/signin"); 
}
