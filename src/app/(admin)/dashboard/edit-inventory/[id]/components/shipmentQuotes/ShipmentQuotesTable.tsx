import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableRow, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { TableHeader } from '@/components/ui/table';
import { MoreDotIcon } from '@/icons';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import { useGetAllShipmentQuotesQuery, useUpdateShipmentQuotesStatusMutation } from '@/store/services/api';
import { useParams } from 'next/navigation';
import Pagination from '@/components/tables/Pagination';
import { ErrorResponse } from '@/app/(admin)/dashboard/accounts/components/AccountsModal';
import { toast } from 'react-toastify';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ShipmentQuotesTable = () => {
    const { id } = useParams();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [activeRowId, setActiveRowId] = useState<string | null>(null);
    const [loadingStatus, setLoadingStatus] = useState<Record<string, boolean>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [updateStatus] = useUpdateShipmentQuotesStatusMutation();

    const {
        data: shipmentQuotes,
        error: shipmentQuotesError,
        isLoading: shipmentQuotesLoading,
        refetch: shipmentQuotesRefetch
    } = useGetAllShipmentQuotesQuery({
        id,
        page: currentPage,
        perPage: perPage,
    });

    const handleStatusUpdate = async (shipmentQuotesId: string, status: 'accept' | 'reject') => {
        setLoadingStatus((prev) => ({ ...prev, [shipmentQuotesId]: true }));
        try {
            await updateStatus({ qoute_id: shipmentQuotesId, status }).unwrap();
            toast.success(`Quote ${status === 'accept' ? 'accepted' : 'rejected'} successfully!`);
            shipmentQuotesRefetch();
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            if (errorResponse?.data?.error) {
                if (Array.isArray(errorResponse.data.error)) {
                    errorResponse.data.error.forEach((msg) => toast.error(msg));
                } else if (typeof errorResponse.data.error === 'string') {
                    toast.error(errorResponse.data.error);
                }
            } else {
                toast.error(`Failed to ${status} quote`);
            }
        } finally {
            setLoadingStatus((prev) => ({ ...prev, [shipmentQuotesId]: false }));
            setOpenDropdown(null);
        }
    };

    const toggleDropdown = (id: string) => {
        if (openDropdown === id) {
            setOpenDropdown(null);
            setActiveRowId(null);
        } else {
            setOpenDropdown(id);
            setActiveRowId(id);
        }
    };

    const closeDropdown = () => {
        setOpenDropdown(null);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePerPageChange = (newPerPage: number) => {
        setPerPage(newPerPage);
        setCurrentPage(1);
    };

    if (shipmentQuotesLoading) return <div>Loading...</div>;
    if (shipmentQuotesError) return <div>Error loading shipment quotes</div>;

    // Group quotes by status
    const groupedQuotes = {
        accepted: shipmentQuotes?.data?.data?.filter((quote: any) => quote.status === 'accept') || [],
        others: shipmentQuotes?.data?.data?.filter((quote: any) => quote.status !== 'accept') || []
    };

    const hasAcceptedQuotes = groupedQuotes.accepted.length > 0;
    const hasOtherQuotes = groupedQuotes.others.length > 0;
    const showAccordions = hasAcceptedQuotes && hasOtherQuotes;

    const renderTableSection = (quotes: any[], title?: string, showPagination: boolean = true) => (
        <div className="rounded-lg border border-[#DDD] bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            {title && (
                <div className="bg-[#F7F7F7] border-b border-[#DDD] px-5 py-3 font-medium">
                    {title}
                </div>
            )}
            <div className="overflow-auto rounded-lg">
                <Table className='table-auto'>
                    <TableHeader className="border-b bg-[#F7F7F7] text-[#616161] font-family font-medium text-[12.5px] border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            {[
                                'Company Name', 'Quote Amount', 'Estimated Time of Arrival', 'Contact Information', 'Action'
                            ].map((heading) => (
                                <TableCell key={heading} className="px-5 py-3 whitespace-nowrap overflow-hidden font-medium text-gray-500 text-start text-[14px] dark:text-gray-400">
                                    <div className='w-full flex gap-5 justify-between items-center'>
                                        {heading}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                            <path d="M4.8513 6.35227C4.63162 6.57194 4.63162 6.9281 4.8513 7.14777C5.07097 7.36743 5.42707 7.36743 5.64675 7.14777L4.8513 6.35227ZM7.49902 4.50002H8.06152C8.06152 4.27251 7.9245 4.0674 7.71427 3.98034C7.50412 3.89327 7.26217 3.9414 7.1013 4.10227L7.49902 4.50002ZM6.93652 13.5C6.93652 13.8107 7.18837 14.0625 7.49902 14.0625C7.80967 14.0625 8.06152 13.8107 8.06152 13.5H6.93652ZM13.1468 11.6477C13.3664 11.4281 13.3664 11.072 13.1468 10.8523C12.9271 10.6326 12.5709 10.6326 12.3513 10.8523L13.1468 11.6477ZM10.499 13.5H9.93652C9.93652 13.7275 10.0736 13.9326 10.2838 14.0197C10.4939 14.1068 10.7359 14.0586 10.8968 13.8977L10.499 13.5ZM11.0615 4.50002C11.0615 4.18936 10.8097 3.93752 10.499 3.93752C10.1884 3.93752 9.93652 4.18936 9.93652 4.50002H11.0615ZM5.64675 7.14777L7.89675 4.89777L7.1013 4.10227L4.8513 6.35227L5.64675 7.14777ZM6.93652 4.50002L6.93652 13.5H8.06152V4.50002H6.93652ZM12.3513 10.8523L10.1013 13.1023L10.8968 13.8977L13.1468 11.6477L12.3513 10.8523ZM11.0615 13.5L11.0615 4.50002H9.93652L9.93652 13.5H11.0615Z" fill="#616161" />
                                        </svg>
                                    </div>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHeader>
                     {/* ${activeRowId === lead.id ? 'bg-[#FFFAF3]' : ''} */}

                    <TableBody className="dark:divide-white/[0.05]">
                        {quotes.map((lead: any) => (
                            <TableRow className={`!border-b-0 
                                
                                
                                `} 
                                key={lead.id}
                            >
                                <TableCell className="px-5 py-2 !border-none !text-[#616161] !font-normal !text-[14px] !font-family text-start whitespace-nowrap overflow-hidden">
                                    {lead.user?.company_name || '---'}
                                </TableCell>
                                <TableCell className="px-5 py-2 !border-none !text-[#616161] !font-normal !text-[14px] !font-family text-start">
                                    {lead.shipping_cost ? `$${lead.shipping_cost}` : '---'}
                                </TableCell>
                                <TableCell className="px-5 py-2 !border-none !text-[#616161] !font-normal !text-[14px] !font-family text-start">
                                    {lead.estimate_arrival_time || '---'}
                                </TableCell>
                                <TableCell className="px-5 py-2 !border-none !text-[#616161] !font-normal !text-[14px] !font-family text-start">
                                    {lead.user?.address || '---'}
                                </TableCell>
                                <TableCell className="px-5 py-2 !border-none !text-[#616161] !font-normal !text-[14px] !font-family text-center relative">
                                    <div className="relative inline-block">
                                        <button
                                            onClick={() => toggleDropdown(lead.id)}
                                            className={`dropdown-toggle p-1 rounded ${openDropdown === lead.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                                            disabled={loadingStatus[lead.id]}
                                        >
                                            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                                        </button>

                                        {openDropdown === lead.id && (
                                            <div className="absolute right-0 top-full mt-1 z-[999] w-48 bg-white shadow-md border rounded-sm">
                                               {lead.status !== 'accept' && (
  <DropdownItem
  onItemClick={() => {
      handleStatusUpdate(lead.id, 'accept');
  }}
  className="flex w-full text-left text-[12px] font-family text-[#414141] whitespace-nowrap font-normal rounded dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
>
  Accept & Confirm Shipment
</DropdownItem>
                                               )}
                                              
                                                <DropdownItem
                                                    onItemClick={() => {
                                                        handleStatusUpdate(lead.id, 'reject');
                                                    }}
                                                    className="flex w-full text-left text-[12px] font-family text-[#414141] whitespace-nowrap font-normal rounded dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                                >
                                                    Reject Quote
                                                </DropdownItem>
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {showPagination && (
                <div className='px-6 border-t'>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={shipmentQuotes?.data?.last_page || 1}
                        onPageChange={handlePageChange}
                        perPage={perPage}
                        onPerPageChange={handlePerPageChange}
                    />
                </div>
            )}
        </div>
    );

    if (showAccordions) {
        return (
            <div className="space-y-4">
                <Accordion 
                sx={{ borderRadius: '0.8rem !important', overflow: 'hidden', boxShadow:'none' }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        className="bg-[#F7F7F7] border-b border-[#DDD]"
                    >
                        <p className="font-medium">Accepted Quotes</p>
                    </AccordionSummary>
                    <AccordionDetails className="p-0">
                        {renderTableSection(groupedQuotes.accepted, undefined, false)}
                    </AccordionDetails>
                </Accordion>

                <Accordion 
                sx={{ borderRadius: '0.8rem !important', overflow: 'hidden', boxShadow:'none' }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        className="bg-[#F7F7F7] border-b border-[#DDD]"
                    >
                        <p className="font-medium">Archive Quotes</p>
                    </AccordionSummary>
                    <AccordionDetails className="p-0">
                        {renderTableSection(groupedQuotes.others)}
                    </AccordionDetails>
                </Accordion>
            </div>
        );
    }

    return renderTableSection(shipmentQuotes?.data?.data || []);
};

export default ShipmentQuotesTable;