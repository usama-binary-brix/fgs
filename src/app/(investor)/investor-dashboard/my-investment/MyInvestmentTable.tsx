"use client";

import { useState } from 'react';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { MoreDotIcon } from '@/icons';
import { IoSearchOutline } from 'react-icons/io5'

import { useAddInvestmentMutation, useDeleteInventoryMutation, useGetAllInventoryQuery, useGetAllUserInvestmentsQuery } from '@/store/services/api';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { toast } from 'react-toastify';

import { useRouter } from 'next/navigation';
import AddLeadInput from '@/app/(admin)/dashboard/leads/components/input/AddLeadInput';
import { useFormik } from 'formik';



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

const MyInvestmentTable = () => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const { data, isLoading, error } = useGetAllUserInvestmentsQuery('');
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
const handleNavigate = (id:any)=>{
    router.push(`my-investment/view-project/${id}`)
}
    const formik = useFormik({
        initialValues: {
            investmentAmount: '',
        },
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
            } catch (error) {
                let errorMessage = "An unexpected error occurred";

                if (error instanceof Error) {
                    errorMessage = error.message;
                } else if (typeof error === "object" && error !== null && "error" in error) {
                    errorMessage = (error as { error: string }).error;
                }

                toast.error(errorMessage);

            } finally {
                setSubmitting(false);
            }
        },
    });

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
                                    />
                                </div>
                            </div>
                        </div>
                    </div>


                </div>


                <div className="rounded-xl border  border-[#DDD] bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className=" overflow-auto">
                        <Table className='table-auto'>
                            <TableHeader className="border-b bg-[#F7F7F7] text-[#616161] font-family font-medium text-[12.5px] border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    {[
                                        'ID', 'ELEVATOR MANUFACTURER', 'ELEVATOR MODEL', 'ELEVATOR SERIAL', 'PURCHASE DATE',
                                        'PURCHASE PRICE', 'MY INVESTMENT', 'RECONDITIONING %', 'COMPLETION DATE', 'SALE PRICE', 'TOTAL INVESTORS', 'STATUS',
                                        'ACTION'
                                    ].map((heading) => (
                                        <TableCell key={heading} isHeader className="px-5 py-3 whitespace-nowrap overflow-hidden font-medium text-gray-500 text-start text-[14px] dark:text-gray-400">
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
                                {data?.investment?.map((lead: any) => (
                                    <TableRow key={lead.id}>
                                        <TableCell className="px-5 py-4 text-[#616161]  text-[14px] font-family text-start whitespace-nowrap overflow-hidden">{lead.inventory.id}</TableCell>
                                        <TableCell className="px-5 py-4 text-[#616161] whitespace-nowrap text-[14px] font-family  text-start">{lead.inventory.make}</TableCell>
                                        <TableCell className="px-5 py-4 text-[#616161] whitespace-nowrap text-[14px] font-family  text-start">{lead.inventory.model}</TableCell>
                                        <TableCell className="px-5 py-4 text-[#616161] whitespace-nowrap text-[14px] font-family  text-start">{lead.inventory.serial_no}</TableCell>
                                        <TableCell className="px-5 py-4 text-[#616161] whitespace-nowrap text-[14px] font-family  text-start">{lead.inventory.date_purchased}</TableCell>
                                        <TableCell className="px-5 py-4 text-[#616161] whitespace-nowrap text-[14px] font-family  text-start">$ {lead.inventory.price_paid || '---'}</TableCell>
                                        <TableCell className="px-5 py-4 text-[#616161] whitespace-nowrap text-[14px] font-family  text-start">$ {lead.investment_amount || '---'}</TableCell>
                                        <TableCell className="px-5 py-4 text-[#616161] whitespace-nowrap text-[14px] font-family text-start">{lead.inventory.reconditioning || '---'}</TableCell>
                                        <TableCell className="px-5 py-4 text-[#616161] whitespace-nowrap text-[14px] font-family text-start">{lead.inventory.completionDate || '---'}</TableCell>
                                        <TableCell className="px-5 py-4 text-[#616161] text-[14px] font-family text-start">{lead.inventory.salePrice || '---'}</TableCell>

                                        <TableCell className="px-5 py-4 text-[#616161] text-[14px] font-family  text-center">{lead.inventory.totalInvestors || '---'}</TableCell>


                                        {lead.inventory.status ? (
                                            <TableCell className="px-5 py-4 text-xs">
                                                <span
                                                    className={`px-3 py-1 rounded-md text-sm font-medium ${lead.inventory.status === 'in progress'
                                                        ? 'bg-orange-100 text-orange-500'
                                                        : lead.inventory.status === 'sold'
                                                            ? 'bg-green-100 text-green-600'
                                                            : lead.inventory.status === 'pending'
                                                                ? 'bg-[#8E7F9C1F] text-[#8E7F9C]'
                                                                : ''
                                                        }`}
                                                >
                                                    {lead.inventory.status.charAt(0).toUpperCase() + lead.inventory.status.slice(1)} {/* Capitalize */}
                                                </span>
                                            </TableCell>
                                        ) : (
                                            <TableCell className="px-5 py-4 text-[#616161] text-[14px] font-familytext-start">
                                                <span
                                                    className={`px-3 py-3 rounded-md text-sm font-medium bg-[#8E7F9C1F] text-[#8E7F9C]`}
                                                >
                                                    Pending
                                                </span>
                                            </TableCell>
                                        )}


                                        <TableCell className="px-5 py-4 text-[#616161] text-[14px] font-family text-start">
                                            <div className="relative inline-block">
                                                <button onClick={() => toggleDropdown(lead.id)} className="dropdown-toggle">
                                                    <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                                                </button>
                                                <Dropdown isOpen={openDropdown === lead.id} onClose={closeDropdown} className="w-40 p-2">
                                                    <DropdownItem onItemClick={()=>handleNavigate(lead.id)} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                                                        View Details
                                                    </DropdownItem>


                                                </Dropdown>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
            <Dialog
                open={isOpen}
                onClose={handleCloseModal}
            >
                <form onSubmit={formik.handleSubmit}>
                    <DialogTitle>Request Investment for {selectedId}</DialogTitle>
                    <DialogContent

                    >
                        <div className="mb-2">
                            <AddLeadInput
                                name="investmentAmount"
                                value={formik.values.investmentAmount}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                label="Investment Amount"
                            />
                            {formik.touched.investmentAmount && formik.errors.investmentAmount && (
                                <p className="text-red-500 text-xs mt-1">{formik.errors.investmentAmount}</p>
                            )}
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleCloseModal}
                            sx={{ color: "#D18428", border: '1px solid #D18428', paddingX: '1rem', textTransform: 'none' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className='bg-primary hover:bg-primary'
                            sx={{ backgroundColor: '#D18428', '&:hover': { backgroundColor: '#D18428' }, textTransform: 'none' }}
                            variant="contained"
                        >
                            Request Investment
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default MyInvestmentTable;

