"use client";

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { IoSearchOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { useGetAllLeadsQuery, useGetAllMyShipmentsQuery } from '@/store/services/api';
import Pagination from '@/components/tables/Pagination';
import { BrokerMetrics } from '@/components/ecommerce/BrokerMetrics';
import { useDebounce } from 'use-debounce';


const brokerTableData = [
    {
        id: "S-73921",
        projectName: "C09701",
        startDate: "3/15/2022",
        expectedDateofDelivery: "3/15/2022",
        quotedRate: "$150.00",

    },
]

const BrokerTable = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10); // Example total pages
    const [perPage, setPerPage] = useState(10); // Default items per page
    const [searchText, setSearchText] = useState('');
    const [debouncedSearchText] = useDebounce(searchText, 300);
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePerPageChange = (newPerPage: number) => {
        setPerPage(newPerPage);
        setCurrentPage(1); // Reset to first page on per-page change
    };

    const { data, isLoading, error } = useGetAllMyShipmentsQuery({
        page: currentPage,
        perPage: perPage,
        search: debouncedSearchText
    });


    console.log(data?.shipments, 'data')
    return (
        <>
            <div className="flex items-center justify-between mb-3">
                <h1 className="text-[16px] text-[#000] font-family font-medium">Overview</h1>
                {/* <select name="" id="" className="border border-[#E1E1E1] text-[#6a6a6a] bg-[#fff] text-[10px] font-semibold font-family rounded-md p-2 outline-0 cursor-pointer">
                    <option value="">This Week</option>
                    <option value="">This Week</option>
                    <option value="">This Week</option>
                </select> */}
            </div>


            <div className="grid grid-cols-12 gap-6 mb-5">

                <div className="col-span-12 xl:col-span-12 space-y-6">
                    <BrokerMetrics />

                </div>


            </div>
            <div className='bg-[#fff]  p-3 rounded-sm'>
                <div className="xl:flex lg:flex md:flex  justify-between items-center mb-4">
                    <div className="text-center mb-3 md:mb-0 lg:mb-0 xl:mb-0">
                        <h1 className='text-[#000] text-[16px] font-medium font-family text-center'>Accepted Shipment Quotes</h1>
                    </div>
                    <div className="flex items-center gap-3">


                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <IoSearchOutline className="absolute left-3 top-1/2 transform w-[20px] h-[20px] text-[#616161] -translate-y-1/2" />
                                <input
                                    className="text-xs border text-[12.5px] text-[#616161] font-medium placeholder-[#616161] font-family pl-9 pr-2 h-9 w-64 border-[#DDD] rounded bg-[#fff] focus:border-[#DDD] focus:outline-none"
                                    placeholder="Search"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                            </div>
                        </div>
                        {/* <Button variant="outlined"
                            size='sm'
                        >
                            View All
                        </Button> */}
                    </div>
                </div>

                <div className="overflow-auto rounded border  border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full h-[30rem] overflow-x-auto">
                        <Table>
                            <TableHeader className="border-b border-gray-100 overflow-auto bg-[#F7F7F7] dark:border-white/[0.05]">
                                <TableRow>
                                    {['ID', 'PROJECT NAME', 'START DATE', 'EXPECTED DATE OF END', 'QUOTED RATE', 'STATUS'].map((heading) => (
                                        <TableCell key={heading} isHeader className="px-3  py-3 font-family whitespace-nowrap overflow-hidden font-medium text-[#616161] text-[12.5px] text-start text-theme-sm dark:text-gray-400">
                                            <div className='flex justify-between gap-2 items-center'>

                                                {heading}
                                                {/* <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                    <path d="M4.8513 6.35227C4.63162 6.57194 4.63162 6.9281 4.8513 7.14777C5.07097 7.36743 5.42707 7.36743 5.64675 7.14777L4.8513 6.35227ZM7.49902 4.50002H8.06152C8.06152 4.27251 7.9245 4.0674 7.71427 3.98034C7.50412 3.89327 7.26217 3.9414 7.1013 4.10227L7.49902 4.50002ZM6.93652 13.5C6.93652 13.8107 7.18837 14.0625 7.49902 14.0625C7.80967 14.0625 8.06152 13.8107 8.06152 13.5H6.93652ZM13.1468 11.6477C13.3664 11.4281 13.3664 11.072 13.1468 10.8523C12.9271 10.6326 12.5709 10.6326 12.3513 10.8523L13.1468 11.6477ZM10.499 13.5H9.93652C9.93652 13.7275 10.0736 13.9326 10.2838 14.0197C10.4939 14.1068 10.7359 14.0586 10.8968 13.8977L10.499 13.5ZM11.0615 4.50002C11.0615 4.18936 10.8097 3.93752 10.499 3.93752C10.1884 3.93752 9.93652 4.18936 9.93652 4.50002H11.0615ZM5.64675 7.14777L7.89675 4.89777L7.1013 4.10227L4.8513 6.35227L5.64675 7.14777ZM6.93652 4.50002L6.93652 13.5H8.06152V4.50002H6.93652ZM12.3513 10.8523L10.1013 13.1023L10.8968 13.8977L13.1468 11.6477L12.3513 10.8523ZM11.0615 13.5L11.0615 4.50002H9.93652L9.93652 13.5H11.0615Z" fill="#616161" />
                                                </svg> */}
                                            </div>


                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody className="overflow-auto">
                                {data?.shipments?.data?.map((lead: any) => (
                                    <TableRow key={lead.id}>
                                        <TableCell className=" px-3 py-3.5 text-[#616161] font-normal whitespace-nowrap overflow-hidden text-[14px] font-family">{lead.
                                            formatted_id
                                        }</TableCell>
                                        <TableCell className="px-3 py-6 text-[14px] flex items-center gap-2 font-family text-[#616161] font-normal">{lead.formatted_inventory_id
                                        }</TableCell>
                                     <TableCell className="px-3 py-3.5 text-[14px] text-[#616161] font-normal font-family max-w-[130px] truncate overflow-hidden text-ellipsis whitespace-nowrap">
  {lead.created_at 
    ? new Date(lead.created_at).toISOString().split('T')[0] // Extracts "YYYY-MM-DD"
    : 'N/A'}
</TableCell>                                    <TableCell className="px-3 py-3.5 text-[14px] text-[#616161] font-normal font-family max-w-[130px] truncate overflow-hidden text-ellipsis whitespace-nowrap">{lead.estimate_arrival_time}</TableCell>
                                        <TableCell className="px-3 py-3.5 text-[14px] text-[#616161] font-normal font-family max-w-[130px] truncate overflow-hidden text-ellipsis whitespace-nowrap">{lead.
                                            shipping_cost
                                        }</TableCell>


                                        {lead.status_display
                                            ? (
                                                <TableCell className=" py-2 text-xs">
                                                    <span
                                                        className={`px-3 py-2 rounded-md text-sm font-medium ${lead.status_display
                                                            === 'in progress'
                                                            ? 'bg-orange-100 text-orange-500'
                                                            : lead.status_display
                                                                === 'complete'
                                                                ? 'bg-green-100 text-green-600'
                                                                : lead.status_display
                                                                    === 'pending'
                                                                    ? 'bg-[#8e7f9c1f] font-family text-[14px] font-medium  text-[#8E7F9C]'
                                                                    : ''
                                                            }`}
                                                    >
                                                        {lead.status_display
                                                            .charAt(0).toUpperCase() + lead.status_display
                                                                .slice(1)} {/* Capitalize */}
                                                    </span>
                                                </TableCell>
                                            ) : (
                                                <TableCell className="px-5 py-2 text-[#616161] text-[14px] font-familytext-start text-left">
                                                    <span
                                                        className={`px-3 py-2 rounded-md text-sm font-medium bg-[#8E7F9C1F] text-[#8E7F9C]`}
                                                    >
                                                        Pending
                                                    </span>
                                                </TableCell>
                                            )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className='px-6 border-t'>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={data?.shipments?.last_page || 1}
                            onPageChange={handlePageChange}
                            perPage={perPage}
                            onPerPageChange={handlePerPageChange}
                        />

                    </div>

                </div>
            </div>

            {/* <DeleteConfirmationModal
                title={'Lead'}
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => handleDeleteLead(selectedId)}
                name={selectedId}
            /> */}

        </>
    );
};

export default BrokerTable;