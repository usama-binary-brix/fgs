"use client";

import { useEffect, useState } from 'react';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { MoreDotIcon } from '@/icons';
import { IoSearchOutline } from 'react-icons/io5'

import { useAddInvestmentMutation, useDeleteInventoryMutation, useGetAllInventoryQuery, useGetAllInvestmentOpportunityQuery } from '@/store/services/api';
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { useRouter } from 'next/navigation';
import AddLeadInput from '@/app/(admin)/dashboard/leads/components/input/AddLeadInput';
import { useFormik } from 'formik';
import { RxCross2 } from 'react-icons/rx';
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import Pagination from '@/components/tables/Pagination';
import { useDebounce } from 'use-debounce';

type ErrorResponse = {
    data: {
        error: Record<string, string>; // `error` contains field names as keys and error messages as values
    };
};


interface Lead {
    id: string;
    elevatorManufacturer: string;
    elevatorModel: string;
    elevatorSerial: string;
    purchaseDate: string;
    purchasePrice: string;
    reconditioning: string;
    completionDate: string;
    invRequests: string;
    totalInvestors: string;
    investmentAmount: string;
    salePrice: string;
    profitAmt: string;
    profit: string;
}

const InvestmentOpportunityTable = () => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [searchText, setSearchText] = useState('');
    const [debouncedSearchText] = useDebounce(searchText, 800);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10); // Example total pages
    const [perPage, setPerPage] = useState(10);

    const { data, isLoading, error } = useGetAllInvestmentOpportunityQuery({
        page: currentPage,
        perPage: perPage,
        search: debouncedSearchText
    });
    const router = useRouter()
    const [addInvestment] = useAddInvestmentMutation()
    const toggleDropdown = (id: string) => {
        setOpenDropdown(openDropdown === id ? null : id);
    };

    const closeDropdown = () => {
        setOpenDropdown(null);
    };
    const handleCloseModal = () => {
        setIsOpen(false);
    };
    const [isOpen, setIsOpen] = useState(false);


    const [openDropdownId, setOpenDropdownId] = useState<string | number | null>();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | number | null>(null);
    const [selectedListingNumber, setSelectedListingNumber] = useState<string | number | null>(null);


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePerPageChange = (newPerPage: number) => {
        setPerPage(newPerPage);
        setCurrentPage(1); // Reset to first page on per-page change
    };

    const formik = useFormik({
        initialValues: {
            investmentAmount: '',
        },
        validationSchema: Yup.object().shape({
            investmentAmount: Yup.number()
                .typeError('Investment amount must be a number')
                .required('Investment amount is required')
                .positive('Amount must be greater than 0'),
        }),
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            try {
                if (!selectedId) {
                    toast.error("No inventory selected");
                    return;
                }
                const payload = {
                    investment_amount: values.investmentAmount,
                    inventory_id: selectedId,
                };
                const response = await addInvestment(payload).unwrap();
                toast.success(response.message);
                resetForm();
                setIsDeleteModalOpen(false);
                setIsOpen(false);
            } catch (error) {
                const errorResponse = error as ErrorResponse;
                if (errorResponse?.data?.error) {
                    if (Array.isArray(errorResponse.data.error)) {
                        errorResponse.data.error.forEach((msg) => toast.error(msg));
                    } else {
                        if (typeof errorResponse.data.error === 'string') {
                            toast.error(errorResponse.data.error);
                        }
                        //  toast.error(errorResponse.data.error);
                    }
                }


            } finally {
                setSubmitting(false);
            }
        },
    });
    useEffect(() => {
        formik.resetForm();

    }, [isOpen, selectedId]);

    // useEffect(() => {
    //     formik.setFieldValue("investmentAmount", "");
    // }, [selectedId]);

    return (
        <>
            <div className=''>
                <div className="flex justify-between items-center mb-3">
                    <div className="inline-flex items-center gap-3">
                        <div className="hidden sm:block">
                            <div className="flex items-center space-x-2">

                                <div className="relative">

                                    <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#616161]" />
                                    <input
                                        className="text-xs border bg-white rounded-lg pl-9 pr-2 h-9 w-64 border-[#DDD] font-family font-medium text-[12.5px] text-[#616161] focus:border-gray-400 focus:outline-none"
                                        placeholder="Search"
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>


                </div>

                {isLoading ? (
                    <>
                        <div className="py-6 flex items-center justify-center h-96">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>

                    </>
                ) : (<>
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="max-w-full h-[30rem] overflow-x-auto">
                            <Table className='table-auto'>
                                <TableHeader className="sticky top-0 z-50 border-b bg-[#F7F7F7] text-[#616161] font-family font-medium text-[12.5px] border-gray-100 dark:border-white/[0.05]">
                                    <TableRow>
                                        {[
                                            'ID', 'ELEVATOR MANUFACTURER', 'ELEVATOR MODEL', 'ELEVATOR SERIAL', 'PURCHASE DATE',
                                            'PURCHASE PRICE', 'RECONDITIONING %', 'COMPLETION DATE', 'SALE PRICE', 'TOTAL INVESTORS',
                                            'ACTIONS'
                                        ].map((heading) => (
                                            <TableCell key={heading} isHeader className="px-10 py-3 whitespace-nowrap overflow-hidden font-medium text-gray-500 text-start text-[14px] dark:text-gray-400">
                                                <div className=' w-full flex justify-between items-center '>
                                                    {heading}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                        <path d="M4.8513 6.35227C4.63162 6.57194 4.63162 6.9281 4.8513 7.14777C5.07097 7.36743 5.42707 7.36743 5.64675 7.14777L4.8513 6.35227ZM7.49902 4.50002H8.06152C8.06152 4.27251 7.9245 4.0674 7.71427 3.98034C7.50412 3.89327 7.26217 3.9414 7.1013 4.10227L7.49902 4.50002ZM6.93652 13.5C6.93652 13.8107 7.18837 14.0625 7.49902 14.0625C7.80967 14.0625 8.06152 13.8107 8.06152 13.5H6.93652ZM13.1468 11.6477C13.3664 11.4281 13.3664 11.072 13.1468 10.8523C12.9271 10.6326 12.5709 10.6326 12.3513 10.8523L13.1468 11.6477ZM10.499 13.5H9.93652C9.93652 13.7275 10.0736 13.9326 10.2838 14.0197C10.4939 14.1068 10.7359 14.0586 10.8968 13.8977L10.499 13.5ZM11.0615 4.50002C11.0615 4.18936 10.8097 3.93752 10.499 3.93752C10.1884 3.93752 9.93652 4.18936 9.93652 4.50002H11.0615ZM5.64675 7.14777L7.89675 4.89777L7.1013 4.10227L4.8513 6.35227L5.64675 7.14777ZM6.93652 4.50002L6.93652 13.5H8.06152V4.50002H6.93652ZM12.3513 10.8523L10.1013 13.1023L10.8968 13.8977L13.1468 11.6477L12.3513 10.8523ZM11.0615 13.5L11.0615 4.50002H9.93652L9.93652 13.5H11.0615Z" fill="#616161" />
                                                    </svg>
                                                </div>

                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHeader>

                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {data?.inventories?.data?.map((lead: any) => (
                                        <TableRow key={lead.id}>
                                            <TableCell className="px-10 py-4 text-[#616161]  text-[14px] font-family text-start whitespace-nowrap overflow-hidden">{lead.listing_number}</TableCell>
                                            <TableCell className="px-10 py-4 text-[#616161] whitespace-nowrap text-[14px] font-family  text-start">{lead.make}</TableCell>
                                            <TableCell className="px-10 py-4 text-[#616161] whitespace-nowrap text-[14px] font-family  text-start">{lead.model}</TableCell>
                                            <TableCell className="px-10 py-4 text-[#616161] whitespace-nowrap text-[14px] font-family  text-start">{lead.serial_no}</TableCell>
                                            <TableCell className="px-10 py-4 text-[#616161] whitespace-nowrap text-[14px] font-family  text-start">{lead.date_purchased}</TableCell>
                                            <TableCell className="px-10 py-4 text-[#616161] whitespace-nowrap text-[14px] font-family  text-start">$ {lead.price_paid || '---'}</TableCell>
                                            <TableCell className="px-10 py-4 text-[#616161] whitespace-nowrap text-[14px] font-family text-start">{lead.reconditioning || '---'}</TableCell>
                                            <TableCell className="px-10 py-4 text-[#616161] whitespace-nowrap text-[14px] font-family text-start">{lead.completionDate || '---'}</TableCell>
                                            <TableCell className="px-10 py-4 text-[#616161] text-[14px] font-family text-start">{lead.salePrice || '---'}</TableCell>

                                            <TableCell className="px-10 py-4 text-[#616161] text-[14px] font-family  text-center">{lead.total_investors || '---'}</TableCell>


                                            <TableCell className="px-5 py-2 text-[#616161] text-[14px] font-family text-center">
                                                <div className="relative inline-block">
                                                    <button
                                                        // disabled={lead.complete_investment}
                                                        onClick={() => {
                                                            setOpenDropdownId(null);
                                                            setSelectedId(lead.id);
                                                            setIsOpen(true); // Open the modal for investment request
                                                            setSelectedListingNumber(lead.listing_number);
                                                            closeDropdown(); // Close the dropdown after the action
                                                        }} className={`dropdown-toggle text-xs p-1 rounded text-black underline`}>
                                                        Request Investment

                                                    </button>

                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className='px-6 border-t'>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={data?.inventories?.last_page || 1}
                                onPageChange={handlePageChange}
                                perPage={perPage}
                                onPerPageChange={handlePerPageChange}
                            />

                        </div>
                    </div>
                </>)}

            </div>
            <Dialog
                // sx={{ minWidth: '30rem' }}
                open={isOpen}
                onClose={handleCloseModal}
            >
                <form onSubmit={formik.handleSubmit}>
                    <div className=' border-b border-gray-400 mb-3 py-3'>

                        <div className='flex justify-between items-center px-4  md:gap-20'>
                            <p className=' md:text-xl font-semibold'>Request Investment for {selectedListingNumber}</p>

                            <RxCross2 onClick={handleCloseModal} className='cursor-pointer text-3xl' />

                        </div>
                    </div>
                    <div className=' px-5'>
                        <div className="mb-2">
                            <label className="text-[13px] text-[#818181] font-normal font-family" htmlFor='InvestmentAmount'>
                                Investment Amount $ <span className="text-red-500">*</span>


                            </label>


                            <input
                                value={formik.values.investmentAmount}
                                onChange={(e: any) => {
                                    const value = e.target.value;
                                    if (/^\d*\.?\d*$/.test(value) && value !== "0" && value !== "00") {
                                        formik.setFieldValue("investmentAmount", value);
                                    }
                                }}
                                onBlur={formik.handleBlur}
                                type="text"
                                placeholder="Enter your investment amount"
                                name="investmentAmount"
                                className="w-full px-2 py-1.5 text-[#666] placeholder-[#666] text-[12px] 
                                font-medium rounded-xs border border-[#E8E8E8] mt-1 outline-none text-md"
                            />
                            {formik.touched.investmentAmount && formik.errors.investmentAmount && (
                                <div className="text-red-500 text-[12px] mt-1">
                                    {formik.errors.investmentAmount}
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogActions>

                        <div className='flex items-center gap-4'>
                            <Button onClick={handleCloseModal} variant="fgsoutline"
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={formik.isSubmitting}
                                type="submit"
                                variant="primary"
                            >
                                Request Investment
                            </Button>
                        </div>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default InvestmentOpportunityTable;