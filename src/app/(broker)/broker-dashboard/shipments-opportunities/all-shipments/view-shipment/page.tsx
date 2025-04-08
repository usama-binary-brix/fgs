"use client";


import MuiDatePicker from '@/components/CustomDatePicker';
import Button from '@/components/ui/button/Button';
import React, { useState } from 'react'
import SubmitQuoteModal from '../../../components/SubmitQuoteModal';

const page = () => {

    const [isOpen, setIsOpen] = useState(false);
    const handleQuoteModal = () => {
        setIsOpen(true);
    }
    const handleCloseQuoteModal = () => {
        setIsOpen(false);
    }
    return (
        <>

            <div className="row mb-5">
                <div className="col-span-12">
                    <div className='bg-white p-3 rounded'>
                        <h1 className='text-[#414141] text-[27px] font-extrabold font-family'>S-73921</h1>
                        <p className='text-[#555] text-[14px] font-normal font-family mb-2'>Shipment</p>
                        <Button
                            type="submit"
                            variant="primary"
                            size='sm'
                            onClick={handleQuoteModal}

                        >
                            Shipments Details
                        </Button>

                    </div>
                </div>

            </div>
            <div className="row hidden">
                <div className='bg-white p-3 rounded'>
                    <h1 className='text-[#000] text-[17px] font-medium font-family mb-2'>My Quote</h1>
                    <div className='grid grid-cols-12 gap-4'>
                    <div className="col-span-6">
                        <div className='flex flex-col gap-2 '>
                            <label htmlFor="" className='text-[#818181] text-[12.5px] font-normal font-family'>Shipping Cost</label>
                            <input type="text" className='border-1 border-[#e8e8e8] outline-0 text-[#616161] text-[13px] font-medium font-family px-2 py-1' />
                        </div>
                    </div>
                    <div className="col-span-6">
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="" className='text-[#818181] text-[12.5px] font-normal font-family'>Shipping Cost</label>
                            <input type="text" className='border-1 border-[#e8e8e8] outline-0 text-[#616161] text-[13px] font-medium font-family px-2 py-1' />
                        </div>
                    </div>
                    </div>
                   
                </div>

            </div>
            <div className="row">
                <div className="col-span-12">
                    <div className='flex justify-end mb-4'>

                        <Button
                            type="submit"
                            variant="primary"
                            size='sm'
                            onClick={handleQuoteModal}

                        >
                            Submit Qoute
                        </Button>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className='grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 gap-4'>
                    {/* shipment details */}
                    <div className="bg-white w-full h-[195px] rounded p-3">
                        <h1 className="text-[#000] text-[14px] font-family font-medium mb-2 flex items-center gap-2">
                            Shipment Details
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                <path d="M5.03339 7.18587C5.31309 7.16667 5.65791 7.16667 6.10137 7.16667H9.89863C10.3421 7.16667 10.6869 7.16667 10.9666 7.18587M5.03339 7.18587C4.68432 7.2098 4.43668 7.26367 4.2253 7.38467C3.89037 7.5764 3.61807 7.88233 3.44742 8.25867C3.25342 8.68653 3.25342 9.24653 3.25342 10.3667V11.3C3.25342 12.4201 3.25342 12.9801 3.44742 13.408C3.61807 13.7843 3.89037 14.0903 4.2253 14.282C4.60605 14.5 5.10449 14.5 6.10137 14.5H9.89863C10.8955 14.5 11.3939 14.5 11.7747 14.282C12.1096 14.0903 12.3819 13.7843 12.5526 13.408C12.7466 12.9801 12.7466 12.4201 12.7466 11.3V10.3667C12.7466 9.24653 12.7466 8.68653 12.5526 8.25867C12.3819 7.88233 12.1096 7.5764 11.7747 7.38467C11.5633 7.26367 11.3157 7.2098 10.9666 7.18587M5.03339 7.18587V5.83333C5.03339 3.99239 6.36159 2.5 8 2.5C9.6384 2.5 10.9666 3.99239 10.9666 5.83333V7.18587" stroke="#818181" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </h1>


                        <div className='col-span-1 mb-3'>
                            <label className="text-[12.5px] text-[#818181] font-normal font-family" >

                                Shipment Date <span className='text-red-500'>*</span>

                            </label>

                            <MuiDatePicker
                                name="date_purchased"
                                value=""
                                disabled


                            />
                        </div>
                        <div className='col-span-1'>
                            <label className="text-[12.5px] text-[#818181] font-normal font-family" >

                                Expected Arrival Date  <span className='text-red-500'>*</span>

                            </label>

                            <MuiDatePicker
                                name="date_purchased"
                                value=""
                                className='hover:border-0 outline-0 focus:outline-0 focus:border-0'
                                disabled

                            />
                        </div>

                    </div>
                    {/* inventory details */}
                    <div className="bg-white w-full rounded p-3">
                        <h1 className="text-[#000] text-[14px] font-family font-medium mb-2 flex items-center gap-2">
                            Inventory Details
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                <path d="M5.03339 7.18587C5.31309 7.16667 5.65791 7.16667 6.10137 7.16667H9.89863C10.3421 7.16667 10.6869 7.16667 10.9666 7.18587M5.03339 7.18587C4.68432 7.2098 4.43668 7.26367 4.2253 7.38467C3.89037 7.5764 3.61807 7.88233 3.44742 8.25867C3.25342 8.68653 3.25342 9.24653 3.25342 10.3667V11.3C3.25342 12.4201 3.25342 12.9801 3.44742 13.408C3.61807 13.7843 3.89037 14.0903 4.2253 14.282C4.60605 14.5 5.10449 14.5 6.10137 14.5H9.89863C10.8955 14.5 11.3939 14.5 11.7747 14.282C12.1096 14.0903 12.3819 13.7843 12.5526 13.408C12.7466 12.9801 12.7466 12.4201 12.7466 11.3V10.3667C12.7466 9.24653 12.7466 8.68653 12.5526 8.25867C12.3819 7.88233 12.1096 7.5764 11.7747 7.38467C11.5633 7.26367 11.3157 7.2098 10.9666 7.18587M5.03339 7.18587V5.83333C5.03339 3.99239 6.36159 2.5 8 2.5C9.6384 2.5 10.9666 3.99239 10.9666 5.83333V7.18587" stroke="#818181" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </h1>


                        <div className='col-span-1 mb-3'>
                            <label className="text-[12.5px] text-[#818181] font-normal font-family" >

                                Year

                            </label>

                            <input
                                disabled
                                value={"2023"}
                                type='text'
                                className="w-full  px-2 py-1.5 text-[#414141] placeholder-[#666] text-[12px] font-medium rounded-xs border border-[#E8E8E8] mt-1 outline-none text-md"



                            />
                        </div>
                        <div className='col-span-1'>
                            <label className="text-[12.5px] text-[#818181] font-normal font-family" >

                                Make

                            </label>

                            <input
                                disabled
                                value={"toyota"}
                                type='text'
                                className="w-full  px-2 py-1.5 text-[#414141] placeholder-[#666] text-[12px] font-medium rounded-xs border border-[#E8E8E8] mt-1 outline-none text-md"



                            />
                        </div>
                        <div className='col-span-1'>
                            <label className="text-[12.5px] text-[#818181] font-normal font-family" >

                                Model

                            </label>

                            <input
                                disabled
                                value={"C25L"}
                                type='text'
                                className="w-full  px-2 py-1.5 text-[#414141] placeholder-[#666] text-[12px] font-medium rounded-xs border border-[#E8E8E8] mt-1 outline-none text-md"



                            />

                        </div>
                        <div className='col-span-1'>
                            <label className="text-[12.5px] text-[#818181] font-normal font-family" >

                                Serial No.

                            </label>

                            <input
                                disabled
                                value={"C09701"}
                                type='text'
                                className="w-full  px-2 py-1.5 text-[#414141] placeholder-[#666] text-[12px] font-medium rounded-xs border border-[#E8E8E8] mt-1 outline-none text-md"



                            />
                        </div>
                        <div className='col-span-1'>
                            <label className="text-[12.5px] text-[#818181] font-normal font-family" >

                                Length

                            </label>

                            <input
                                disabled
                                value={"7.5 meters"}
                                type='text'
                                className="w-full  px-2 py-1.5 text-[#414141] placeholder-[#666] text-[12px] font-medium rounded-xs border border-[#E8E8E8] mt-1 outline-none text-md"



                            />
                        </div>
                        <div className='col-span-1'>
                            <label className="text-[12.5px] text-[#818181] font-normal font-family" >

                                Height

                            </label>

                            <input
                                disabled
                                value={"150 kilograms"}
                                type='text'
                                className="w-full  px-2 py-1.5 text-[#414141] placeholder-[#666] text-[12px] font-medium rounded-xs border border-[#E8E8E8] mt-1 outline-none text-md"



                            />
                        </div>
                        <div className='col-span-1'>
                            <label className="text-[11.5px] text-[#818181] font-normal font-family" >

                                Width

                            </label>

                            <input
                                disabled
                                value={"3.2 meters"}
                                type='text'
                                className="w-full  px-2 py-1.5 text-[#414141] placeholder-[#666] text-[12px] font-medium rounded-xs border border-[#E8E8E8] mt-1 outline-none text-md"



                            />
                        </div>
                        <div className='col-span-1'>
                            <label className="text-[12.5px] text-[#818181] font-normal font-family" >

                                Weight

                            </label>

                            <input
                                disabled
                                value={"80 kilograms"}
                                type='text'
                                className="w-full  px-2 py-1.5 text-[#414141] placeholder-[#666] text-[12px] font-medium rounded-xs border border-[#E8E8E8] mt-1 outline-none text-md"



                            />
                        </div>

                    </div>
                    {/* adress */}
                    <div className="bg-white w-full rounded p-3 h-[365px]">
                        <h1 className="text-[#000] text-[14px] font-family font-medium mb-2 flex items-center gap-2">
                            Adress
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                <path d="M5.03339 7.18587C5.31309 7.16667 5.65791 7.16667 6.10137 7.16667H9.89863C10.3421 7.16667 10.6869 7.16667 10.9666 7.18587M5.03339 7.18587C4.68432 7.2098 4.43668 7.26367 4.2253 7.38467C3.89037 7.5764 3.61807 7.88233 3.44742 8.25867C3.25342 8.68653 3.25342 9.24653 3.25342 10.3667V11.3C3.25342 12.4201 3.25342 12.9801 3.44742 13.408C3.61807 13.7843 3.89037 14.0903 4.2253 14.282C4.60605 14.5 5.10449 14.5 6.10137 14.5H9.89863C10.8955 14.5 11.3939 14.5 11.7747 14.282C12.1096 14.0903 12.3819 13.7843 12.5526 13.408C12.7466 12.9801 12.7466 12.4201 12.7466 11.3V10.3667C12.7466 9.24653 12.7466 8.68653 12.5526 8.25867C12.3819 7.88233 12.1096 7.5764 11.7747 7.38467C11.5633 7.26367 11.3157 7.2098 10.9666 7.18587M5.03339 7.18587V5.83333C5.03339 3.99239 6.36159 2.5 8 2.5C9.6384 2.5 10.9666 3.99239 10.9666 5.83333V7.18587" stroke="#818181" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </h1>


                        <div className='col-span-1 mb-3'>
                            <label className="text-[12.5px] text-[#818181] font-normal font-family" >

                                Adress <span className='text-red-500'>*</span>

                            </label>

                            <input
                                disabled
                                value={"2023"}
                                type='text'
                                className="w-full  px-2 py-1.5 text-[#414141] placeholder-[#666] text-[12px] font-medium rounded-xs border border-[#E8E8E8] mt-1 outline-none text-md"



                            />
                        </div>
                        <div className='col-span-1'>
                            <label className="text-[12.5px] text-[#818181] font-normal font-family" >

                                Country <span className='text-red-500'>*</span>

                            </label>

                            <input
                                disabled
                                value={"Hoist"}
                                type='text'
                                className="w-full  px-2 py-1.5 text-[#414141] placeholder-[#666] text-[12px] font-medium rounded-xs border border-[#E8E8E8] mt-1 outline-none text-md"



                            />
                        </div>
                        <div className='col-span-1'>
                            <label className="text-[12.5px] text-[#818181] font-normal font-family" >

                                Country/Region <span className='text-red-500'>*</span>

                            </label>

                            <input
                                disabled
                                value={"C25L"}
                                type='text'
                                className="w-full  px-2 py-1.5 text-[#414141] placeholder-[#666] text-[12px] font-medium rounded-xs border border-[#E8E8E8] mt-1 outline-none text-md"



                            />

                        </div>
                        <div className='col-span-1'>
                            <label className="text-[12.5px] text-[#818181] font-normal font-family" >

                                City<span className='text-red-500'>*</span>

                            </label>

                            <input
                                disabled
                                value={"C09701"}
                                type='text'
                                className="w-full  px-2 py-1.5 text-[#414141] placeholder-[#666] text-[12px] font-medium rounded-xs border border-[#E8E8E8] mt-1 outline-none text-md"



                            />
                        </div>
                        <div className='col-span-1'>
                            <label className="text-[12.5px] text-[#818181] font-normal font-family" >

                                Zip Code <span className='text-red-500'>*</span>

                            </label>

                            <input
                                disabled
                                value={"7.5 meters"}
                                type='text'
                                className="w-full  px-2 py-1.5 text-[#414141] placeholder-[#666] text-[12px] font-medium rounded-xs border border-[#E8E8E8] mt-1 outline-none text-md"



                            />
                        </div>

                    </div>
                    {/* addition information */}
                    <div className="bg-white w-full h-[135px] rounded p-3">
                        <h1 className="text-[#000] text-[14px] font-family font-medium mb-2 flex items-center gap-2">
                            Additional Information
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                <path d="M5.03339 7.18587C5.31309 7.16667 5.65791 7.16667 6.10137 7.16667H9.89863C10.3421 7.16667 10.6869 7.16667 10.9666 7.18587M5.03339 7.18587C4.68432 7.2098 4.43668 7.26367 4.2253 7.38467C3.89037 7.5764 3.61807 7.88233 3.44742 8.25867C3.25342 8.68653 3.25342 9.24653 3.25342 10.3667V11.3C3.25342 12.4201 3.25342 12.9801 3.44742 13.408C3.61807 13.7843 3.89037 14.0903 4.2253 14.282C4.60605 14.5 5.10449 14.5 6.10137 14.5H9.89863C10.8955 14.5 11.3939 14.5 11.7747 14.282C12.1096 14.0903 12.3819 13.7843 12.5526 13.408C12.7466 12.9801 12.7466 12.4201 12.7466 11.3V10.3667C12.7466 9.24653 12.7466 8.68653 12.5526 8.25867C12.3819 7.88233 12.1096 7.5764 11.7747 7.38467C11.5633 7.26367 11.3157 7.2098 10.9666 7.18587M5.03339 7.18587V5.83333C5.03339 3.99239 6.36159 2.5 8 2.5C9.6384 2.5 10.9666 3.99239 10.9666 5.83333V7.18587" stroke="#818181" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </h1>


                        <div className='col-span-1 mb-3 flex flex-col gap-2'>
                            <label className="text-[12.5px] text-[#818181] font-normal font-family" >

                                Shipping Notes <span className='text-red-500'>*</span>

                            </label>

                            <textarea disabled name="" className='border-1 border-[#e8e8e8] rounded-xs text-[#414141] font-family font-medium' id=""></textarea>
                        </div>


                    </div>
                </div>

            </div>

            <SubmitQuoteModal open={isOpen} onClose={handleCloseQuoteModal} />
        </>
    )
}


export default page