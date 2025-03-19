"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
// import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
// import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
// import Link from "next/link";
import { useLoginMutation } from "@/store/services/api";
import { setUser } from "@/store/services/userSlice";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  // const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();

  const [login, { isLoading, error }] = useLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();

      dispatch(setUser({ user: res.user, token: res.token }));
console.log(res, 'res')
      if (res.user.role === "admin") {
        router.push("/dashboard");
      } else if (res.user.role === "investor") {
        router.push("/investor-dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <form>
            <div className="space-y-6">
              <div>
                <Label>Email <span className="text-error-500">*</span></Label>
                <Input
                  placeholder="info@gmail.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label>Password <span className="text-error-500">*</span></Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? <EyeIcon className="fill-gray-500 dark:fill-gray-400" /> : <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />}
                  </span>
                </div>
              </div>
              {/* <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                    Keep me logged in
                  </span>
                </div>
                <Link href="/reset-password" className="text-sm text-primary hover:text-primary dark:text-whie">
                  Forgot password?
                </Link>
              </div> */}
              {error && <p className="text-error-500">Invalid credentials</p>}
              <div>
              <button onClick={handleLogin} className="w-full bg-primary hover:bg-primary py-2 text-white rounded-lg" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
                {/* <TopButtons type="submit" className="w-full bg-primary hover:bg-primary" size="sm" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </TopButtons> */}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
