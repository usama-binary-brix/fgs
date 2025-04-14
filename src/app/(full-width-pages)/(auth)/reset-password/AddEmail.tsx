"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { useLoginMutation } from "@/store/services/api";
import { setUser } from "@/store/services/userSlice";
import Link from "next/link";

export default function AddEmail() {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();
    const [login, { isLoading }] = useLoginMutation();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Please enter a valid email.")
                .required("Email is required."),
            password: Yup.string().required("Password is required."),
        }),
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            try {
                const res = await login(values).unwrap();
                dispatch(setUser({ user: res.user, token: res.token }));

                if (res.user.account_type === "investor") {
                    router.push("/investor-dashboard");
                } else if (res.user.account_type === "admin") {
                    router.push("/dashboard");
                } else if (res.user.account_type === "salesperson") {
                    router.push("/sales-dashboard");
                } else if (res.user.account_type === "employee") {
                    router.push("/employee-dashboard");
                } else if (res.user.account_type === "broker") {
                    router.push("/broker-dashboard");
                } else {
                    router.push("/");
                }
            }
            catch (err: any) {
                setFieldError("password", err?.data?.message || err?.data?.error || "Login failed");

            }
            setSubmitting(false);
        },
    });

    return (
        <div className="flex flex-col flex-1 lg:w-1/2 w-full">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Forget Password
                        </h1>
                    </div>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="space-y-6">
                            <div>
                                <Label>Email <span className="text-error-500">*</span></Label>
                                <Input
                                    placeholder="info@gmail.com"
                                    type="email"
                                    {...formik.getFieldProps("email")}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <p className="text-error-500 text-sm">{formik.errors.email}</p>
                                )}
                            </div>
                            <div>
                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-primary hover:bg-primary py-2 text-white rounded-lg"
                                        disabled={isLoading || formik.isSubmitting}
                                    >
                                        {isLoading || formik.isSubmitting ? "Sumitting" : "Reset Password"}
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
