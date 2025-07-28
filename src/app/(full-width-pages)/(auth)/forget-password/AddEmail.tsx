"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { useForgetPasswordMutation, useLoginMutation } from "@/store/services/api";
import { setUser } from "@/store/services/userSlice";
import Link from "next/link";
import { toast } from "react-toastify";


type ErrorResponse = {
    data: {
      error: Record<string, string>;
    };
  };

  
export default function AddEmail() {

    const [forgetPassword, { isLoading }] = useForgetPasswordMutation();

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Please enter a valid email.")
                .required("Email is required."),
        }),
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            try {
                const res = await forgetPassword(values).unwrap();
toast.success(res.message)

            }
            catch (err: any) {
                setFieldError("email", err?.data?.message || err?.error);
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
                            Forgot Password
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
                                        {isLoading || formik.isSubmitting ? "Submitting" : "Reset Password"}
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
