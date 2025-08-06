"use client";
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { useSingleUserQuery, useUpdateUserInfoMutation } from '@/store/services/api';
import { setUser, updateUserData } from '@/store/services/userSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useEffect, useRef, useState } from 'react'
import { FiCamera, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { EyeCloseIcon, EyeIcon } from '@/icons';
import { toast } from 'react-toastify';
import ButtonLoader from '@/components/ButtonLoader';
import { optionalPasswordValidationSchema, optionalConfirmPasswordValidationSchema } from '@/lib/validation';
import PasswordStrengthIndicator from '@/components/form/PasswordStrengthIndicator';

interface SettingsFormProps {
    className?: string;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({ className = "" }) => {
    // const [selected, setSelected] = useState(null);
    // const User1 = useSelector((state: any) => state.user.user);
    // const { data: user, error } = useSingleUserQuery(User1.id, { skip: !User1.id });
    // const User = user.user
    // const [updateUserInfo, { isLoading }] = useUpdateUserInfoMutation();
    // const [isEdit, setIsEdit] = useState(false);
    // const [isImageRemoved, setIsImageRemoved] = useState(false);
    // const [initialValues, setInitialValues] = useState({
    //     first_name: User?.first_name || '',
    //     last_name: User?.last_name || '',
    //     email: User?.email || '',
    //     phone_number: User?.phone_number || '',
    //     profile_image: User?.profile_image || null,
    //     old_password: '',
    //     new_password: '',
    //     new_password_confirmation: '',
    // });
    const [selected, setSelected] = useState(null);
    const User1 = useSelector((state: any) => state.user.user);
    const { data, error, isLoading: isUserLoading } = useSingleUserQuery(User1?.id, {
        skip: !User1?.id,
    });

    const user = data?.user;
    const [updateUserInfo, { isLoading }] = useUpdateUserInfoMutation();
    const [isEdit, setIsEdit] = useState(false);
    const [isImageRemoved, setIsImageRemoved] = useState(false);

    const [initialValues, setInitialValues] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        profile_image: null,
        old_password: '',
        new_password: '',
        new_password_confirmation: '',
    });
    useEffect(() => {
        if (user) {
            const newInitialValues = {
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone_number: user.phone_number || '',
                profile_image: user.profile_image || null,
                old_password: '',
                new_password: '',
                new_password_confirmation: '',
            };
            setInitialValues(newInitialValues);
            setImage(user.profile_image || null);

            // Also reset Formik's values directly
            formik.setValues(newInitialValues);
        }
    }, [user]);

    const handleSelect = (index: any) => {
        setSelected(index);
    };

    const [image, setImage] = useState<string | null>(user?.profile_image || null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        setIsImageRemoved(true);
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
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            // Password validation
            if (values.old_password || values.new_password || values.new_password_confirmation) {
                if (!values.old_password) {
                    toast.error('Old password is required');
                    setSubmitting(false);
                    return;
                }
                if (!values.new_password) {
                    toast.error('New password is required');
                    setSubmitting(false);
                    return;
                }
                if (values.new_password.length < 8) {
                    toast.error('New password must be at least 8 characters');
                    setSubmitting(false);
                    return;
                }
                if (!values.new_password_confirmation) {
                    toast.error('Confirm password is required');
                    setSubmitting(false);
                    return;
                }
                if (values.new_password !== values.new_password_confirmation) {
                    toast.error('Passwords do not match');
                    setSubmitting(false);
                    return;
                }
            }

            try {
                const formData = new FormData();
                formData.append('first_name', values.first_name);
                formData.append('last_name', values.last_name);
                formData.append('email', values.email);
                formData.append('phone_number', values.phone_number);

                if (profileImageFile) {
                    formData.append('profile_image', profileImageFile);
                }

                if (isImageRemoved) {
                    formData.append('remove_profile_image', '1');
                }

                if (values.old_password) {
                    formData.append('old_password', values.old_password);
                }
                if (values.new_password) {
                    formData.append('new_password', values.new_password);
                }
                if (values.new_password_confirmation) {
                    formData.append('new_password_confirmation', values.new_password_confirmation);
                }

                const response = await updateUserInfo(formData).unwrap();
                toast.success(response.message || 'Profile updated successfully');



                // Reset form and state
                // resetForm();
                setIsEdit(false);
                setImage(response.data?.profile_image || user?.profile_image);
                setProfileImageFile(null);
                setIsImageRemoved(false);

                // Update initial values
                setInitialValues({
                    first_name: values.first_name,
                    last_name: values.last_name,
                    email: values.email,
                    phone_number: values.phone_number,
                    profile_image: response.data?.profile_image || user?.profile_image,
                    old_password: '',
                    new_password: '',
                    new_password_confirmation: '',
                });

            } catch (error: any) {
                const errorResponse = error as any;
                if (errorResponse?.data?.error) {
                    Object.values(errorResponse.data.error).forEach((errorMessage: any) => {
                        if (Array.isArray(errorMessage)) {
                            errorMessage.forEach((msg: string) => toast.error(msg));
                        } else {
                            toast.error(errorMessage);
                        }
                    });
                } else {
                    toast.error('Failed to update profile');
                }
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleEditClick = () => {
        setIsEdit(true);
    };
    // Update Redux store
    useEffect(() => {
        if (user) {
            dispatch(updateUserData({ user }));
        }
    }, [user, dispatch]);
    const handleCancelClick = () => {
        formik.resetForm({ values: initialValues });
        setIsEdit(false);
        setImage(user?.profile_image || null);
        setProfileImageFile(null);
        setIsImageRemoved(false);
    };

    if (isUserLoading) {
        return <div>Loading user data...</div>;
    }

    if (error) {
        return <div>Error loading user data</div>;
    }

    if (!user) {
        return <div>No user data found</div>;
    }



    return (
        <div className={className}>
            <div className="flex items-center justify-between mb-4 text-[25px] font-extrabold">
                <h3 className="">Settings</h3>
                {!isEdit && (
                    <Button
                        type="button"
                        variant="primary"
                        className='px-10'
                        onClick={handleEditClick}
                    >
                        Edit
                    </Button>
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
                                        <div className="relative">
                                            <Input
                                                placeholder="Enter old password"
                                                type={showOldPassword ? "text" : "password"}
                                                name="old_password"
                                                value={formik.values.old_password}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                disabled={!isEdit}
                                                autoComplete="new-password"
                                                maxLength={16}
                                            />
                                            <span
                                                onClick={() => setShowOldPassword(!showOldPassword)}
                                                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                            >
                                                {showOldPassword ? <EyeIcon className="fill-gray-500 dark:fill-gray-400" /> : <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />}
                                            </span>
                                        </div>
                                        {formik.touched.old_password && formik.errors.old_password && (
                                            <p className="text-error-500 text-sm">{String(formik.errors.old_password)}</p>
                                        )}
                                    </div>

                                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-2'>
                                        <div className="mb-4">
                                            <Label>New Password</Label>
                                            <div className="relative">
                                                <Input
                                                    placeholder="Enter new password"
                                                    type={showNewPassword ? "text" : "password"}
                                                    name="new_password"
                                                    value={formik.values.new_password}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    disabled={!isEdit}
                                                    autoComplete="auto-password"
                                                    maxLength={16}
                                                />
                                                <span
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                                >
                                                    {showNewPassword ? <EyeIcon className="fill-gray-500 dark:fill-gray-400" /> : <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />}
                                                </span>
                                            </div>
                                            {formik.values.new_password && (
                                                <PasswordStrengthIndicator password={formik.values.new_password} />
                                            )}
                                            {formik.touched.new_password && formik.errors.new_password && (
                                                <p className="text-error-500 text-sm">{String(formik.errors.new_password)}</p>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <Label>Confirm New Password</Label>
                                            <div className="relative">
                                                <Input
                                                    placeholder="Confirm new password"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    name="new_password_confirmation"
                                                    value={formik.values.new_password_confirmation}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    disabled={!isEdit}
                                                    autoComplete="new-password"
                                                    maxLength={16}
                                                />
                                                <span
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                                >
                                                    {showConfirmPassword ? <EyeIcon className="fill-gray-500 dark:fill-gray-400" /> : <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />}
                                                </span>
                                            </div>
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
        </div>
    );
}; 