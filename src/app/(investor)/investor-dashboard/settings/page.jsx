"use client";
import React, { useState } from 'react'
import { FiCamera, FiX, FiCheck } from "react-icons/fi";

const page = () => {
    const [selected, setSelected] = useState(null);


    const handleSelect = (index) => {
        setSelected(index);
    };
    return (
        <>
            <div className='mb-5'>
                <h1 className='text-xl font-bold'>Settings</h1>
            </div>
            <div className="container">
                <div className="row justify-center">
                    <div className="gird gird-cols-1">
                        {/* section 1 */}
                        <div className='max-w-xl mx-auto mb-5'>
                            <div className='mb-2'>
                                <h1 className='text-lg font-normal text-black'>Your Profile</h1>
                                <p className='text-xs text-customGray'>Update your profile here</p>
                            </div>


                            <div className="bg-white shadow-md rounded-lg p-6 w-full">
                                <div className="flex items-center space-x-6 mb-4">
                                    {/* Profile Pic Section */}
                                    <div className='flex items-center gap-20'>
                                        <div>
                                            <label className='text-xs text-custom-darkGray' htmlFor="">Profile Pic</label>
                                        </div>
                                        <div className="relative">
                                            <img
                                                src="/profile.jpg"
                                                alt=""
                                                className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                                            />

                                            <label className="absolute top-0 right-0 bg-orange-400 text-white p-1 rounded-full cursor-pointer">
                                                <FiCamera className="w-4 h-4" />
                                            </label>
                                            <div className="flex flex-col">
                                                <button className="text-red-500 flex ml-2 items-center text-xs mt-1">
                                                    <FiX className="w-4 h-4" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>

                                    </div>


                                </div>

                                <div className='flex items-center gap-5 mb-4'>
                                    <div className='w-[25%]'>
                                        <label className='text-xs text-custom-darkGray' htmlFor="">Username</label>
                                    </div>
                                    <div className='w-[75%]'>
                                        <input className='p-1 rounded font-normal w-full border-1 outline-0 border-gray-200' placeholder='---' type="text" />
                                    </div>
                                </div>
                                <div className='flex items-center gap-5 mb-4'>
                                    <div className='w-[25%]'>
                                        <label className='text-xs w-full text-custom-darkGray' htmlFor="">Phone Number</label>
                                    </div>
                                    <div className='w-[75%]'>
                                        <input className='p-1 font-normal rounded w-full border-1 outline-0 border-gray-200' placeholder='---' type="number" />
                                    </div>
                                </div>



                            </div>
                        </div>
                        {/* section 2 */}
                        <div className='max-w-xl mx-auto mb-5'>
                            <div className='mb-2'>
                                <h1 className='text-lg font-normal text-black'>Security</h1>
                                <p className='text-xs text-customGray'>change your password here</p>
                            </div>


                            <div className="bg-white shadow-md rounded-lg p-6 w-full">


                                <div className='flex items-center gap-5 mb-4'>
                                    <div className='w-[25%]'>
                                        <label className='text-xs text-custom-darkGray' htmlFor="">Old Password</label>
                                    </div>
                                    <div className='w-[75%]'>
                                        <input className='p-1 rounded font-normal w-full border-1 outline-0 border-gray-200' placeholder='---' type="text" />
                                    </div>
                                </div>
                                <div className='flex items-center gap-5 mb-4'>
                                    <div className='w-[25%]'>
                                        <label className='text-xs w-full text-custom-darkGray' htmlFor="">New Password</label>
                                    </div>
                                    <div className='w-[75%]'>
                                        <input className='p-1 font-normal rounded w-full border-1 outline-0 border-gray-200' placeholder='---' type="number" />
                                    </div>
                                </div>
                                <div className='flex items-center gap-5 mb-4'>
                                    <div className='w-[25%]'>
                                        <label className='text-xs w-full text-custom-darkGray' htmlFor="">Confirm New Password</label>
                                    </div>
                                    <div className='w-[75%]'>
                                        <input className='p-1 font-normal rounded w-full border-1 outline-0 border-gray-200' placeholder='---' type="number" />
                                    </div>
                                </div>



                            </div>
                        </div>

                        {/* section 3 */}
                        <div className='max-w-xl mx-auto'>
                            <div className='mb-2'>
                                <h1 className='text-lg font-normal text-black'>Notifications Preferences</h1>
                                <p className='text-xs text-customGray'>Change your preferences here</p>
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