"use client";

import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { MoreDotIcon } from '@/icons';
import Image from 'next/image';
import { IoSearchOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { useDeleteLeadMutation, useGetAllLeadsQuery, usePromoteToInvestorMutation } from '@/store/services/api';
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { FaUserCircle } from 'react-icons/fa';
import Button from '@/components/ui/button/Button';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import Pagination from '@/components/tables/Pagination';
import { format } from 'date-fns';
import { useDebounce } from 'use-debounce';
import NProgress from "nprogress";

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  source: string;
  reminderDate: string;
  budget: string;
  condition: string;
  assignedTo: string;
  image: string;
}

const LeadsTable = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom');
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10); // Example total pages
  const [perPage, setPerPage] = useState(10); // Default items per page
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText] = useDebounce(searchText, 800);

  const { data, isLoading, error, refetch } = useGetAllLeadsQuery({
    page: currentPage,
    perPage: perPage,
    search: debouncedSearchText,
    type:''
  });


  const toggleDropdown = (id: string, event: React.MouseEvent) => {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    const tableContainer = button.closest('.overflow-auto') as HTMLElement;
    const containerRect = tableContainer?.getBoundingClientRect();
    
    if (containerRect) {
      const spaceBelow = containerRect.bottom - rect.bottom;
      const spaceAbove = rect.top - containerRect.top;
      const dropdownHeight = 160; // Approximate height of dropdown
      
      // If there's not enough space below but enough space above, position dropdown above
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
    
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  const handleNavigate = () => {
     NProgress.start();
    router.push("/dashboard/leads/addnewlead")
  }

  const hanldeViewDetails = (id: any) => {
     NProgress.start();

    router.push(`/dashboard/leads/view-lead/${id}`)
  }


  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // INVRequest Modal


  const [isInvReqModalOpen, setIsInvReqModalOpen] = useState(false);

  const handleOpenInvReqModal = () => {
    setIsInvReqModalOpen(true);
  };

  const handleCloseInvReqModal = () => {
    setIsInvReqModalOpen(false);
  };

  // totalInvestorsModal

  const [isTotalInvModalOpen, setIsTotalInvModalOpen] = useState(false);

  const handleOpenTotalInvModal = () => {
    setIsTotalInvModalOpen(true);
  };

  const handleCloseTotalInvModal = () => {
    setIsTotalInvModalOpen(false);
  };

  const [isOpen, setIsOpen] = useState(false);

  const [openDropdownId, setOpenDropdownId] = useState<string | number | null>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewMoreOpen, setIsViewMoreOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);

  const [selectedListingNumber, setSelectedListingNumber] = useState<string | number | null>(null);

  const [deleteLead, { isLoading: isDeleting }] = useDeleteLeadMutation();
  const [promoteInvestor, { isLoading: isPromoteLoading }] = usePromoteToInvestorMutation();

  const handlePromoteClick = async (leadId: any) => {
    setSelectedId(leadId); // Clicked item ka ID store karo

    try {
      const response = await promoteInvestor({
        lead_id: leadId,
        type: "promote_to_investor",
      }).unwrap();

      console.log("Promotion Successful:", response);
      toast.success("Investor promoted successfully!");
    } catch (error) {
      const err = error as { data?: { error?: string } };
      toast.error(err.data?.error || "Email is Already Promoted");
    }
  };
  const handleDeleteLead = async (leadId: string | number | null) => {
    try {
      await deleteLead(leadId).unwrap();
      toast.success('Lead deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete inventory!');
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page on per-page change
  };

  useEffect(()=>{
    refetch()
  },[])

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openDropdown) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="inline-flex items-center gap-3">
          <div className="hidden sm:block">
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
          </div>
        </div>
        <div className="flex items-center gap-3">


          <Button variant="primary"
            size='sm'
            onClick={handleNavigate}
          >
            Add New Lead
          </Button>
        </div>
      </div>
      {isLoading ? (
        <>
          <div className="py-6 flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>

        </>
      ) : (
        <>
          <div className="relative overflow-auto rounded border  border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full h-[30rem] overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 z-50 border-b border-gray-100 overflow-auto bg-[#F7F7F7] dark:border-white/[0.05]">
                  <TableRow>
                    {['ID', 'Name', 'Email', 'Company', 'Source', 'Reminder Date', 'Budget', 'Condition', 'Lead Type', 'Action'].map((heading) => (
                      <TableCell key={heading} isHeader className="px-3  py-3 font-family whitespace-nowrap overflow-hidden font-medium text-[#616161] text-start text-[14px] dark:text-gray-400">
                        <div className='flex justify-between gap-5 items-center'>

                          {heading}
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M4.8513 6.35227C4.63162 6.57194 4.63162 6.9281 4.8513 7.14777C5.07097 7.36743 5.42707 7.36743 5.64675 7.14777L4.8513 6.35227ZM7.49902 4.50002H8.06152C8.06152 4.27251 7.9245 4.0674 7.71427 3.98034C7.50412 3.89327 7.26217 3.9414 7.1013 4.10227L7.49902 4.50002ZM6.93652 13.5C6.93652 13.8107 7.18837 14.0625 7.49902 14.0625C7.80967 14.0625 8.06152 13.8107 8.06152 13.5H6.93652ZM13.1468 11.6477C13.3664 11.4281 13.3664 11.072 13.1468 10.8523C12.9271 10.6326 12.5709 10.6326 12.3513 10.8523L13.1468 11.6477ZM10.499 13.5H9.93652C9.93652 13.7275 10.0736 13.9326 10.2838 14.0197C10.4939 14.1068 10.7359 14.0586 10.8968 13.8977L10.499 13.5ZM11.0615 4.50002C11.0615 4.18936 10.8097 3.93752 10.499 3.93752C10.1884 3.93752 9.93652 4.18936 9.93652 4.50002H11.0615ZM5.64675 7.14777L7.89675 4.89777L7.1013 4.10227L4.8513 6.35227L5.64675 7.14777ZM6.93652 4.50002L6.93652 13.5H8.06152V4.50002H6.93652ZM12.3513 10.8523L10.1013 13.1023L10.8968 13.8977L13.1468 11.6477L12.3513 10.8523ZM11.0615 13.5L11.0615 4.50002H9.93652L9.93652 13.5H11.0615Z" fill="#616161" />
                          </svg>
                        </div>


                      </TableCell>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody className="overflow-auto">
                  {data?.leads?.data?.map((lead: any) => (
                    <TableRow key={lead.id}>
                      <TableCell className="px-3 py-3.5 text-[#616161] font-normal whitespace-nowrap overflow-hidden text-[14px] font-family">{lead.listing_number}</TableCell>


                      <TableCell className="px-3 py-4 text-[14px] flex items-end gap-2 font-family text-[#616161] font-normal">



                        {lead.image ? (
                          <Image
                            width={32}
                            height={32}
                            src={lead.image}
                            alt={lead.first_name}
                            className="rounded-full"
                          />
                        ) : (
                          <span>
                            <FaUserCircle className="w-6 h-6 text-gray-500" />

                          </span>
                        )}
                        <span>{lead.name}</span>



                      </TableCell>
                      <TableCell className="px-3 py-3.5 text-[14px] text-[#616161] font-normal font-family max-w-[130px] truncate overflow-hidden text-ellipsis whitespace-nowrap">{lead.email}</TableCell>
                      <TableCell className="px-3 py-3.5 text-[14px] text-[#616161] font-normal font-family max-w-[130px] truncate overflow-hidden text-ellipsis whitespace-nowrap">{lead.company || '---'}</TableCell>
                      <TableCell className="px-3 py-3.5 text-[14px] text-[#616161] font-normal font-family max-w-[130px] truncate overflow-hidden text-ellipsis whitespace-nowrap">{lead.lead_source || '---'}</TableCell>
                      <TableCell className="px-3 py-3.5 text-[14px] text-[#616161] whitespace-nowrap overflow-hidden font-normal font-family">
                        {format(new Date(lead.reminder_date_time), "dd-MM-yy")}
                      </TableCell>
                      <TableCell className="px-3 py-3.5 text-[14px] text-[#616161] whitespace-nowrap overflow-hidden font-normal font-family">{lead.budget_min ? `$ ${lead.budget_min}` : '---'}</TableCell>
                      <TableCell className="px-3 py-3.5 text-[14px] text-[#616161] whitespace-nowrap overflow-hidden font-normal font-family">{lead.condition || '---'}</TableCell>
                      <TableCell className="px-3 py-3.5 text-[14px] text-[#616161] whitespace-nowrap overflow-hidden font-normal font-family capitalize">{lead.lead_type || '---'}</TableCell>
                      <TableCell className="px-3 py-3.5 text-[14px] text-[#616161] whitespace-nowrap overflow-visible relative  font-normal font-family">
                        <div className="relative inline-block" ref={openDropdown === lead.id ? dropdownRef : null}>
                          <button onClick={(event) => toggleDropdown(lead.id, event)} className={`dropdown-toggle p-1 rounded ${openDropdown === lead.id ? 'bg-gray-100' : ''}`}>
                            <MoreDotIcon className="text-gray-400 font-family hover:text-gray-700 dark:hover:text-gray-300" />
                          </button>
                          {openDropdown === lead.id && (
                            <div className={`absolute right-9 ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-[-4px] mt-1'} z-[999] w-40 bg-white shadow-md border rounded-sm`}>
                              <DropdownItem
                                onItemClick={() => {
                                  hanldeViewDetails(lead.id);
                                  closeDropdown();
                                }}
                                className="flex w-full font-normal px-4 text-[12px] border-b border-[#E9E9E9] text-[#414141]"
                              >
                                View Details
                              </DropdownItem>
                              {lead.type === 'lead' && (
                                <DropdownItem
                                  onItemClick={() => hanldeViewDetails(lead.id)}
                                  className="flex w-full font-normal !px-4 text-[12px] font-family border-b border-[#E9E9E9] text-[#414141]"
                                >
                                  Edit
                                </DropdownItem>
                              )}
                              <DropdownItem
                                onItemClick={() => {
                                  if (lead.type === 'lead') {
                                    handlePromoteClick(lead.id);
                                  }
                                  closeDropdown();
                                }}
                                className="flex w-full font-normal !px-4 text-[12px] font-family border-b border-[#E9E9E9] text-[#414141]"
                              >
                                {isPromoteLoading && selectedId === lead.id ? (
                                  "Promoting..."
                                ) : lead.type === 'lead' ? (
                                  "Promote to investor"
                                ) : (
                                  <span className="text-green-500">Already Promoted</span>
                                )}
                              </DropdownItem>
                              <DropdownItem
                                onItemClick={() => {
                                  setSelectedId(lead.id);
                                  setSelectedListingNumber(lead.listing_number);
                                  setIsDeleteModalOpen(true);
                                  closeDropdown();
                                }}
                                className="flex w-full font-normal px-4 text-[12px] text-[#414141]"
                              >
                                Delete
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
            <div className='px-6 border-t'>

              <Pagination
                currentPage={currentPage}
                totalPages={data?.leads?.last_page || 1}
                onPageChange={handlePageChange}
                perPage={perPage}
                onPerPageChange={handlePerPageChange}
              />

            </div>

          </div>

        </>
      )}

      <DeleteConfirmationModal
        title={'Lead'}
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => handleDeleteLead(selectedId)}
        name={selectedListingNumber}
      />

    </>
  );
};

export default LeadsTable;