"use client";


import MuiDatePicker from '@/components/CustomDatePicker';
import React from 'react'

const page = () => {
    return (
        <>
            <div className="row">
                <div className='grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 gap-4'>
                    <div className="bg-white w-full rounded p-3">
                        <h1 className="text-[#000] text-[14px] font-family font-medium mb-2 flex items-center gap-2">
                            Contact Information
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                <path d="M5.03339 7.18587C5.31309 7.16667 5.65791 7.16667 6.10137 7.16667H9.89863C10.3421 7.16667 10.6869 7.16667 10.9666 7.18587M5.03339 7.18587C4.68432 7.2098 4.43668 7.26367 4.2253 7.38467C3.89037 7.5764 3.61807 7.88233 3.44742 8.25867C3.25342 8.68653 3.25342 9.24653 3.25342 10.3667V11.3C3.25342 12.4201 3.25342 12.9801 3.44742 13.408C3.61807 13.7843 3.89037 14.0903 4.2253 14.282C4.60605 14.5 5.10449 14.5 6.10137 14.5H9.89863C10.8955 14.5 11.3939 14.5 11.7747 14.282C12.1096 14.0903 12.3819 13.7843 12.5526 13.408C12.7466 12.9801 12.7466 12.4201 12.7466 11.3V10.3667C12.7466 9.24653 12.7466 8.68653 12.5526 8.25867C12.3819 7.88233 12.1096 7.5764 11.7747 7.38467C11.5633 7.26367 11.3157 7.2098 10.9666 7.18587M5.03339 7.18587V5.83333C5.03339 3.99239 6.36159 2.5 8 2.5C9.6384 2.5 10.9666 3.99239 10.9666 5.83333V7.18587" stroke="#818181" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </h1>


                        <div className='col-span-1'>
                            <label className="text-[11.5px] text-[#818181] font-normal font-family" >

                                Shipment Date <span className='text-red-500'>*</span>

                            </label>

                            <MuiDatePicker
                                name="date_purchased"
                                value=""

                            />
                        </div>

                    </div>
                </div>

            </div>
        </>
    )
}

export default page