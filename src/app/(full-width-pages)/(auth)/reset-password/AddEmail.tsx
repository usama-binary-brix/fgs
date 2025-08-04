"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Link from "next/link";
import { toast } from "react-toastify";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { useResetPasswordMutation } from "@/store/services/api";
import Select from "@/components/form/Select";
import { passwordValidationSchema, confirmPasswordValidationSchema } from "@/lib/validation";
import PasswordStrengthIndicator from "@/components/form/PasswordStrengthIndicator";


export default function ResetPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const email = searchParams.get("email");
 const options = [
    { value: "super_admin", label: "Super Admin" },

    { value: "admin", label: "Admin" },
    { value: "investor", label: "Investor" },
    { value: "salesperson", label: "Sales Person" },
    { value: "employee", label: "Employee" },
    { value: "broker", label: "Broker" },
  ];

const router = useRouter()
    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const formik = useFormik({
        initialValues: {
            account_type:"",
            password: "",
            password_confirmation: "",
        },
        validationSchema: Yup.object({
            account_type: Yup.string().required("Account type is required"),
            password: passwordValidationSchema,
            password_confirmation: confirmPasswordValidationSchema,
        }),
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            if (!token || !email) {
                toast.error("Invalid reset link");
                return;
            }

            try {
                const res = await resetPassword({
                    token,
                    email,
                    account_type:values.account_type,
                    password: values.password,
                    password_confirmation: values.password_confirmation
                }).unwrap();
                toast.success(res.message);
                router.push('/signin')
            } catch (err: any) {
                const errorMessage = err?.data?.message || err?.error || "Failed to reset password";
                toast.error(errorMessage);
                
                if (err?.data?.errors) {
                    // Handle field-specific errors if your API returns them
                    Object.entries(err.data.errors).forEach(([field, message]) => {
                        setFieldError(field, Array.isArray(message) ? message[0] : message);
                    });
                }
            }
            setSubmitting(false);
        },
    });

    if (!token || !email) {
        return (
            <div className="flex flex-col flex-1 lg:w-1/2 w-full">
                <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                    <div className="p-4 text-error-500">
                        Invalid password reset link. Please make sure you're using the correct link from your email.
                    </div>
                    <Link href="/forgot-password" className="text-primary hover:underline">
                        Request a new reset link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1 lg:w-1/2 w-full">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Reset Password
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Enter your new password for {email}
                        </p>
                    </div>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="space-y-6">
                            <div>
                                         <Label>Account Type <span className="text-error-500">*</span></Label>
                                         <Select
                                           name="account_type"
                                           value={formik.values.account_type}
                                           options={options}
                                           onChange={formik.handleChange}
                                           onBlur={formik.handleBlur}
                                           error={formik.touched.account_type ? formik.errors.account_type : undefined}
                                           required
                                         />
                                       </div>
                           
                            <div>
                                <Label>Password <span className="text-error-500">*</span></Label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        maxLength={16}
                                        {...formik.getFieldProps("password")}
                                    />
                                    <span
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                    >
                                        {showPassword ? <EyeIcon className="fill-gray-500 dark:fill-gray-400" /> : <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />}
                                    </span>
                                </div>
                                {formik.values.password && (
                                    <PasswordStrengthIndicator password={formik.values.password} />
                                )}
                                {formik.touched.password && formik.errors.password && (
                                    <div className="mt-1 text-sm text-error-500">{formik.errors.password}</div>
                                )}
                            </div>
                            <div>
                                <Label>Password Confirmation <span className="text-error-500">*</span></Label>
                                <div className="relative">
                                    <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        maxLength={16}
                                        {...formik.getFieldProps("password_confirmation")}
                                    />
                                    <span
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                    >
                                        {showConfirmPassword ? <EyeIcon className="fill-gray-500 dark:fill-gray-400" /> : <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />}
                                    </span>
                                </div>
                                {formik.touched.password_confirmation && formik.errors.password_confirmation && (
                                    <div className="mt-1 text-sm text-error-500">{formik.errors.password_confirmation}</div>
                                )}
                            </div>
                            <div>
                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-primary hover:bg-primary py-2 text-white rounded-lg disabled:opacity-50"
                                        disabled={isLoading || formik.isSubmitting}
                                    >
                                        {isLoading || formik.isSubmitting ? "Submitting..." : "Reset Password"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}