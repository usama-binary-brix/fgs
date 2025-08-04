"use client";
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import { PageTitle } from '@/components/PageTitle';
import Button from '@/components/ui/button/Button';
import { useUpdateUserInfoMutation } from '@/store/services/api';
import { setUser, updateUserData } from '@/store/services/userSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useRef, useState } from 'react'
import { FiCamera, FiX, FiCheck } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ButtonLoader from '@/components/ButtonLoader';
import { ErrorResponse } from '@/app/(admin)/dashboard/accounts/components/AccountsModal';
import { optionalPasswordValidationSchema, optionalConfirmPasswordValidationSchema } from '@/lib/validation';
import PasswordStrengthIndicator from '@/components/form/PasswordStrengthIndicator';

const Page = () => {
    const [selected, setSelected] = useState(null);
    const User = useSelector((state: any) => state.user.user);
    const [updateUserInfo, { isLoading }] = useUpdateUserInfoMutation();
    const [isEdit, setIsEdit] = useState(false);
    const [isImageRemoved, setIsImageRemoved] = useState(false);
    const [initialValues, setInitialValues] = useState({
        first_name: User?.first_name || '',
        last_name: User?.last_name || '',
        email: User?.email || '',
        phone_number: User?.phone_number || '',
        profile_image: User?.profile_image || null,
        old_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const handleSelect = (index: any) => {
        setSelected(index);
    };


    const [image, setImage] = useState<string | null>(User?.profile_image || null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const dispatch = useDispatch()
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
            setProfileImageFile(file);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setProfileImageFile(null);
        setIsImageRemoved(true); // Add this line
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Custom handler for first_name field to only allow letters and spaces
    const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Only allow letters and spaces
        const filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
        formik.setFieldValue('first_name', filteredValue);
    };

    // Custom handler for last_name field to only allow letters and spaces
    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Only allow letters and spaces
        const filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
        formik.setFieldValue('last_name', filteredValue);
    };

    // Custom handler for phone_number field to only allow numbers and + sign
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Only allow numbers and + sign (but + can only be at the beginning)
        let filteredValue = value.replace(/[^0-9+]/g, '');

        // Ensure + can only be at the beginning
        if (filteredValue.includes('+')) {
            const parts = filteredValue.split('+');
            if (parts.length > 2) {
                // If there are multiple + signs, keep only the first one
                filteredValue = '+' + parts.slice(1).join('');
            }
        }

        formik.setFieldValue('phone_number', filteredValue);
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object().shape({
            first_name: Yup.string()
                .required("First name is required")
                .matches(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces")
                .min(2, "First name must be at least 2 characters")
                .max(50, "First name must be less than 50 characters"),
            last_name: Yup.string()
                .matches(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces")
                .min(2, "Last name must be at least 2 characters")
                .max(50, "Last name must be less than 50 characters"),
            email: Yup.string().email("Invalid email").required("Email is required"),
            phone_number: Yup.string()
                .matches(/^[+]?[0-9]+$/, "Phone number can only contain numbers and + sign")
                .min(10, "Phone number must be at least 10 digits")
                .max(15, "Phone number must be less than 15 digits"),
            old_password: Yup.string(),
            new_password: optionalPasswordValidationSchema,
            new_password_confirmation: optionalConfirmPasswordValidationSchema,
        }),
        // validate: (values) => {
        //     const errors: any = {};

        //     if (!values.first_name) {
        //         errors.first_name = 'First name is required';
        //     }

        //     if (!values.last_name) {
        //         errors.last_name = 'Last name is required';
        //     }

        //     if (!values.email) {
        //         errors.email = 'Email is required';
        //     } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        //         errors.email = 'Invalid email address';
        //     }

        //     // Password validation only if any password field is filled
        //     if (values.old_password || values.new_password || values.new_password_confirmation) {
        //         if (!values.old_password) {
        //             errors.old_password = 'Old password is required';
        //         }

        //         if (!values.new_password) {
        //             errors.new_password = 'New password is required';
        //         } else if (values.new_password.length < 8) {
        //             errors.new_password = 'Password must be at least 8 characters';
        //         }

        //         if (values.new_password !== values.new_password_confirmation) {
        //             errors.new_password_confirmation = 'Passwords do not match';
        //         }
        //     }

        //     return errors;
        // },
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const formData = new FormData();


                formData.append('first_name', values.first_name || '');
                formData.append('last_name', values.last_name || '');
                formData.append('email', values.email || '');
                formData.append('phone_number', values.phone_number || '');


                if (isImageRemoved && profileImageFile === null) {

                    formData.append('remove_profile_image', '1');
                } else if (profileImageFile) {

                    formData.append('profile_image', profileImageFile);
                }


                if (values.old_password) {
                    formData.append('old_password', values.old_password);
                    formData.append('new_password', values.new_password);
                    formData.append('new_password_confirmation', values.new_password_confirmation);
                }

                const response = await updateUserInfo(formData).unwrap();

                toast.success(response.message)
                dispatch(updateUserData({ user: response.user }));
                setInitialValues({
                    ...values,
                    profile_image: null,
                });
                setIsEdit(false);
                setProfileImageFile(null);
            } catch (error) {
                const errorResponse = error as ErrorResponse;


                if (errorResponse?.data?.error) {
                    Object.values(errorResponse.data.error).forEach((errorMessage) => {
                        if (Array.isArray(errorMessage)) {
                            errorMessage.forEach((msg) => toast.error(msg));
                        } else {
                            toast.error(errorMessage);
                        }
                    });
                }


            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleEditClick = () => {
        setIsEdit(true);
    };


    const handleCancelClick = () => {
        formik.resetForm();
        setIsEdit(false);
        setImage(User?.profile_image || null);
        setProfileImageFile(null);
        setIsImageRemoved(false);
    };

    return (
        <>
            <div className="flex items-center justify-between mb-4 text-[25px] font-extrabold">
                <h3 className="">Settings</h3>
                {!isEdit && (
                    <Button
                        type="button"
                        variant="primary"
                        className='px-10'
                        onClick={handleEditClick}
                    >
                     Edit                   </Button>
                )}
            </div>
            <div className="container">
                <form onSubmit={formik.handleSubmit}>
                    <div className="row justify-center">
                        <div className="gird gird-cols-1">
                            {/* Profile Section */}
                            <div className='max-w-xl mx-auto mb-5'>
                                <div className='mb-2'>
                                    <h1 className='text-lg font-medium text-black'>Your Profile</h1>
                                    <p className='text-xs text-customGray'>Update your profile here</p>
                                </div>

                                <div className="bg-white shadow-md rounded-lg p-6 w-full">
                                    <div className="flex items-center justify-center space-x-6 mb-4">
                                        <div className='flex items-center justify-center gap-20'>
                                            <div className="relative">
                                                {image ? (
                                                    <>
                                                    <div className='border-1 rounded-full p-3'>
<img
                                                            src={image}
                                                            alt="Profile"
                                                            className="w-20 h-20 object-contain"
                                                        />
                                                        {isEdit && (
                                                            <label
                                                                onClick={() => fileInputRef.current?.click()}
                                                                className="absolute top-0 right-0 bg-orange-400 text-white p-1 rounded-full cursor-pointer"
                                                            >
                                                                <FiCamera className="w-4 h-4" />
                                                            </label>
                                                        )}

                                                    </div>
                                                        
                                                    </>
                                                ) : (
                                                    <>
                                                        <div
                                                            className="w-25 h-25 p-3 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center cursor-pointer"
                                                            onClick={() => isEdit && fileInputRef.current?.click()}
                                                        >
                                                            <FiCamera className="text-gray-500 w-6 h-6" />
                                                        </div>
                                                    </>
                                                )}

                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleImageChange}
                                                    disabled={!isEdit}
                                                    name="profile_image"
                                                />

                                                {image && isEdit && (
                                                    <div className="flex flex-col">
                                                        <button
                                                            onClick={handleRemoveImage}
                                                            className="text-red-500 flex ml-2 items-center text-xs mt-1"
                                                            type="button"
                                                        >
                                                            <FiX className="w-6 h-4" />
                                                            Remove
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-2'>
                                        <div className="mb-4">
                                            <Label>
                                                First Name
                                            </Label>
                                            <Input
                                                placeholder="Enter First Name"
                                                type="text"
                                                name="first_name"
                                                value={formik.values.first_name}
                                                onChange={handleFirstNameChange}
                                                onBlur={formik.handleBlur}
                                                disabled={!isEdit}
                                            />
                                            {formik.touched.first_name && formik.errors.first_name && (
                                                <p className="text-error-500 text-sm">{String(formik.errors.first_name)}</p>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <Label>
                                                Last Name
                                            </Label>
                                            <Input
                                                placeholder="Enter Last Name"
                                                type="text"
                                                name="last_name"
                                                value={formik.values.last_name}
                                                onChange={handleLastNameChange}
                                                onBlur={formik.handleBlur}
                                                disabled={!isEdit}
                                            />
                                            {formik.touched.last_name && formik.errors.last_name && (
                                                <p className="text-error-500 text-sm">{String(formik.errors.last_name)}</p>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <Label>
                                                Email
                                            </Label>
                                            <Input
                                                placeholder="Enter Email"
                                                type="email"
                                                name="email"
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                disabled={!isEdit}
                                            />
                                            {formik.touched.email && formik.errors.email && (
                                                <p className="text-error-500 text-sm">{String(formik.errors.email)}</p>
                                            )}
                                        </div>
                                        <div className="mb-4">
                                            <Label>
                                                Phone Number
                                            </Label>
                                            <Input
                                                placeholder="Enter Phone Number"
                                                type="text"
                                                name="phone_number"
                                                value={formik.values.phone_number}
                                                onChange={handlePhoneChange}
                                                onBlur={formik.handleBlur}
                                                disabled={!isEdit}
                                            />
                                            {formik.touched.phone_number && formik.errors.phone_number && (
                                                <p className="text-error-500 text-sm">{String(formik.errors.phone_number)}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Security Section */}
                            <div className='max-w-xl mx-auto mb-5'>
                                <div className='mb-2'>
                                    <h1 className='text-lg font-normal text-black'>Security</h1>
                                    <p className='text-sm text-customGray'>Change your password here</p>
                                </div>

                                <div className="bg-white shadow-md rounded-lg p-6 w-full">
                                    <div className="mb-4">
                                        <Label>Old Password</Label>
                                        <Input
                                            placeholder="Enter old password"
                                            type="password"
                                            name="old_password"
                                            value={formik.values.old_password}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={!isEdit}
                                            autoComplete="new-password"
                                            maxLength={16}
                                        />
                                        {formik.touched.old_password && formik.errors.old_password && (
                                            <p className="text-error-500 text-sm">{String(formik.errors.old_password)}</p>
                                        )}
                                    </div>

                                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-2'>
                                        <div className="mb-4">
                                            <Label>New Password</Label>
                                            <Input
                                                placeholder="Enter new password"
                                                type="password"
                                                name="new_password"
                                                value={formik.values.new_password}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                disabled={!isEdit}
                                                autoComplete="auto-password"
                                                maxLength={16}
                                            />
                                            {formik.touched.new_password && formik.errors.new_password && (
                                                <p className="text-error-500 text-sm">{String(formik.errors.new_password)}</p>
                                            )}
                                            {isEdit && <PasswordStrengthIndicator password={formik.values.new_password} />}
                                        </div>

                                        <div className="mb-4">
                                            <Label>Confirm New Password</Label>
                                            <Input
                                                placeholder="Confirm new password"
                                                type="password"
                                                name="new_password_confirmation"
                                                value={formik.values.new_password_confirmation}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                disabled={!isEdit}
                                                autoComplete="new-password"
                                                maxLength={16}
                                            />
                                            {formik.touched.new_password_confirmation && formik.errors.new_password_confirmation && (
                                                <p className="text-error-500 text-sm">{String(formik.errors.new_password_confirmation)}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {isEdit && (
                                    <div className='flex items-center justify-end mt-4 gap-4'>
                                        <Button
                                            variant="fgsoutline"
                                            type="button"
                                            onClick={handleCancelClick}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={isLoading || formik.isSubmitting}
                                        >
                                            {isLoading || formik.isSubmitting ? <ButtonLoader /> : 'Submit'}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Page;









{/* <div className="flex items-center gap-5 mb-2">
    <button
        onClick={() => handleSelect(2)}
        className={`w-5 h-5 flex items-center justify-center rounded transition-all ${selected === 2 ? "bg-orange-500" : "bg-gray-300"
            }`}
    >
        {selected === 2 && <FiCheck className="text-white w-4 h-4" />}
    </button>
    <div>
        <h1 className="text-black text-md font-normal">SMS Notifications</h1>
        <p className="text-xs text-gray-500">You will be notified via mobile text message</p>
    </div>
</div>

<div className="flex items-center gap-5 mb-2">
    <button
        onClick={() => handleSelect(3)}
        className={`w-5 h-5 flex items-center justify-center rounded transition-all ${selected === 3 ? "bg-orange-500" : "bg-gray-300"
            }`}
    >
        {selected === 3 && <FiCheck className="text-white w-4 h-4" />}
    </button>
    <div>
        <h1 className="text-black text-md font-normal">Both</h1>
        <p className="text-xs text-gray-500">You will be notified via email & text message</p>
    </div>
</div>  */}