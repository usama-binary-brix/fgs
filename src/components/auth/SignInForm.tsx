"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { useLoginMutation } from "@/store/services/api";
import { setUser } from "@/store/services/userSlice";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();
  const [login, { isLoading, error }] = useLoginMutation();

  // Email Validation - Show error only after typing "@"
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.includes("@") && !emailRegex.test(email)) {
      return "Please enter a valid email.";
    }
    return "";
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError(validateEmail(newEmail));
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (emailError) return;

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setUser({ user: res.user, token: res.token }));

      if (res.user.role === "admin") {
        router.push("/dashboard");
      } else if (res.user.role === "investor") {
        router.push("/investor-dashboard");
      } else {
        router.push("/dashboard");
      }

      setLoginError(""); // Clear any previous login errors
    } catch (err: any) {
      console.error("Login failed:", err);
      setLoginError(err?.data?.message || "Invalid credentials. Please try again.");
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
              {/* Email Input */}
              <div>
                <Label>Email <span className="text-error-500">*</span></Label>
                <Input
                  placeholder="info@gmail.com"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                />
                {emailError && <p className="text-error-500 text-sm">{emailError}</p>}
              </div>

              {/* Password Input */}
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

              {/* API Error Message */}
              {loginError && <p className="text-error-500 text-sm">{loginError}</p>}

              {/* Submit Button */}
              <div>
                <button
                  onClick={handleLogin}
                  className="w-full bg-primary hover:bg-primary py-2 text-white rounded-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
