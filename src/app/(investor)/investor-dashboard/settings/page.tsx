"use client";
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import { PageTitle } from '@/components/PageTitle';
import { useFormik } from 'formik';
import React, { useRef, useState } from 'react'
import { FiCamera, FiX, FiCheck } from "react-icons/fi";
import { useSelector } from 'react-redux';

const page = () => {
    const [selected, setSelected] = useState(null);
    const User = useSelector((state: any) => state.user.user)
    // const username = User?.first_name + User?.last_name
    const handleSelect = (index: any) => {
        setSelected(index);
    };



    const username = `${User?.first_name || ''} ${User?.last_name || ''}`;



    const [image, setImage] = useState<string | null>(User?.image || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formik = useFormik({
        initialValues: {
            username: User?.username || '',
            phone: User?.phone || '',
        },
        onSubmit: (values) => {
            console.log('Updated values:', values);
        },
    });
    return (
        <>
            <PageTitle title='Settings' />
            <div className="container">
                <div className="row justify-center">
                    <div className="gird gird-cols-1">
                        {/* section 1 */}
                        <div className='max-w-xl mx-auto mb-5'>
                            <div className='mb-2'>
                                <h1 className='text-lg font-medium text-black'>Your Profile</h1>
                                <p className='text-xs text-customGray'>Update your profile here</p>
                            </div>


                            <div className="bg-white shadow-md rounded-lg p-6 w-full">
                                <div className="flex items-center space-x-6 mb-4">
                                    {/* Profile Pic Section */}
                                    <div className='flex items-center gap-20'>
                                        <div>
                                            <Label className='text-sm ' htmlFor="">Profile Pic</Label>
                                        </div>
                                        <div className="relative">

                                            {image ? (
                                                <>
                                                    <img
                                                        src={image}
                                                        alt="Profile"
                                                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                                                    />
                                                    <label onClick={() => fileInputRef.current?.click()}
                                                        className="absolute top-0 right-0 bg-orange-400 text-white p-1 rounded-full cursor-pointer">
                                                        <FiCamera className="w-4 h-4" />
                                                    </label>
                                                </>
                                            ) : (

                                                <>
                                                    <div
                                                        className="w-20 h-20 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center cursor-pointer"
                                                        onClick={() => fileInputRef.current?.click()}
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
                                            />

                                            {image && (
                                                <>

                                                    <div className="flex flex-col">
                                                        <button onClick={handleRemoveImage} className="text-red-500 flex ml-2 items-center text-xs mt-1">
                                                            <FiX className="w-4 h-4" />
                                                            Remove
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                    </div>


                                </div>

                                <div className='flex items-center gap-5 mb-4'>
                                    <div className='w-[25%]'>
                                        <Label className='text-sm ' htmlFor="">Username</Label>

                                    </div>
                                    <div className='w-[75%]'>
                                        <Input
                                            value={username || '---'}
                                            onChange={formik.handleChange}

                                            type="text"
                                        />
                                    </div>
                                </div>
                                <div className='flex items-center gap-5 mb-4'>
                                    <div className='w-[25%]'>
                                        <Label className='text-sm ' htmlFor="">Phone Number</Label>

                                    </div>
                                    <div className='w-[75%]'>
                                        <Input
                                            value={User?.phone_number || '---'}
                                            onChange={formik.handleChange}
                                            type="text"
                                        />
                                    </div>
                                </div>



                            </div>
                        </div>
                        {/* section 2 */}
                        <div className='max-w-xl mx-auto mb-5'>
                            <div className='mb-2'>
                                <h1 className='text-lg font-normal text-black'>Security</h1>
                                <p className='text-sm text-customGray'>Change your password here</p>
                            </div>


                            <div className="bg-white shadow-md rounded-lg p-6 w-full">


                                <div className='flex items-center gap-5 mb-4'>
                                    <div className='w-[25%]'>
                                        <Label className='text-sm ' htmlFor="">Old Password</Label>
                                    </div>
                                    <div className='w-[75%]'>
                                        <Input placeholder='---' type="text" />
                                    </div>
                                </div>
                                <div className='flex items-center gap-5 mb-4'>
                                    <div className='w-[25%]'>
                                        <Label className='text-sm w-full ' htmlFor="">New Password</Label>
                                    </div>
                                    <div className='w-[75%]'>
                                        <Input placeholder='---' type="number" />
                                    </div>
                                </div>
                                <div className='flex items-center gap-5 mb-4'>
                                    <div className='w-[25%]'>
                                        <Label className='text-sm w-full ' htmlFor="">Confirm New Password</Label>
                                    </div>
                                    <div className='w-[75%]'>
                                        <Input placeholder='---' type="text" />
                                    </div>
                                </div>



                            </div>
                        </div>

                        {/* section 3 */}
                        <div className='max-w-xl mx-auto'>
                            <div className='mb-2'>
                                <h1 className='text-lg font-normal text-black'>Notifications Preferences</h1>
                                <p className='text-sm text-customGray'>Change your preferences here</p>
                            </div>


                            <div className="bg-white shadow-md rounded-lg p-6 w-full">
                                {/* Email Notifications */}
                                <div className="flex items-center gap-5 mb-2">
                                    <button
                                        onClick={() => handleSelect(1)}
                                        className={`w-5 h-5 flex items-center justify-center rounded transition-all ${selected === 1 ? "bg-orange-500" : "bg-gray-300"
                                            }`}
                                    >
                                        {selected === 1 && <FiCheck className="text-white w-4 h-4" />}
                                    </button>
                                    <div>
                                        <h1 className="text-black text-md font-normal">Email Notifications</h1>
                                        <p className="text-xs text-gray-500">You will be notified via email</p>
                                    </div>
                                </div>

                                {/* SMS Notifications */}
                                <div className="flex items-center gap-5 mb-2">
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

                                {/* Both Notifications */}
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
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}

export default page