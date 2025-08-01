"use client";

import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import { MoreDotIcon } from '@/icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDeleteLeadMutation, useGetAllLeadsQuery, usePromoteToInvestorMutation } from '@/store/services/api';
import { toast } from 'react-toastify';
import { FaUserCircle } from 'react-icons/fa';
import Button from '@/components/ui/button/Button';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { format } from 'date-fns';
import { useDebounce } from 'use-debounce';
import NProgress from "nprogress";
import DataTable, { DataTableColumn } from '@/components/ui/DataTable';

const InvestorLeadsTable = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText] = useDebounce(searchText, 800);
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom');

  const { data, isLoading, error, refetch } = useGetAllLeadsQuery({
    page: currentPage,
    perPage: perPage,
    search: debouncedSearchText,
    type:'investor'
  });

  const toggleDropdown = (id: string, event: React.MouseEvent) => {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    const tableContainer = button.closest('.overflow-x-auto') as HTMLElement;
    const containerRect = tableContainer?.getBoundingClientRect();
    if (containerRect) {
      const spaceBelow = containerRect.bottom - rect.bottom;
      const spaceAbove = rect.top - containerRect.top;
      const dropdownHeight = 160;
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

  const handleNavigate = () => {
     NProgress.start();
    router.push("/dashboard/leads/addnewlead")
  }

  const hanldeViewDetails = (id: any) => {
     NProgress.start();
    router.push(`/dashboard/leads/view-lead/${id}`)
  }

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [selectedListingNumber, setSelectedListingNumber] = useState<string | number | null>(null);

  const [deleteLead, { isLoading: isDeleting }] = useDeleteLeadMutation();
  const [promoteToInvestor, { isLoading: isPromoteLoading }] = usePromoteToInvestorMutation();

  const handlePromoteClick = async (leadId: any) => {
    setSelectedId(leadId);

    try {
      const response = await promoteToInvestor({
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
      toast.error('Failed to delete lead!');
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const handleSearch = (searchText: string) => {
    setSearchText(searchText);
  };

  // Define table columns
  const columns: DataTableColumn[] = [
    {
      key: 'listing_number',
      header: 'ID',
      render: (value) => (
        <span className="text-[#616161] font-normal text-[14px] font-family overflow-hidden">
          {value}
        </span>
      ),
      width: '80px'
    },
    {
      key: 'name',
      header: 'Name',
      render: (value, row) => (
        <div className="flex items-end gap-2 text-[14px] font-family text-[#616161] font-normal">
          {row.image ? (
            <Image
              width={32}
              height={32}
              src={row.image}
              alt={row.first_name}
              className="rounded-full"
            />
          ) : (
            <span>
              <FaUserCircle className="w-6 h-6 text-gray-500" />
            </span>
          )}
          <span>{value}</span>
        </div>
      ),
      width: '200px'
    },
    {
      key: 'email',
      header: 'Email',
      render: (value) => (
        <span className="text-[14px] text-[#616161] font-normal font-family max-w-[130px] truncate overflow-hidden text-ellipsis">
          {value}
        </span>
      ),
      width: '200px'
    },
    {
      key: 'company',
      header: 'Company',
      render: (value) => (
        <span className="text-[14px] text-[#616161] font-normal font-family max-w-[130px] truncate overflow-hidden text-ellipsis">
          {value || '---'}
        </span>
      ),
      width: '150px'
    },
    {
      key: 'lead_source',
      header: 'Source',
      render: (value) => (
        <span className="text-[14px] text-[#616161] font-normal font-family max-w-[130px] truncate overflow-hidden text-ellipsis">
          {value || '---'}
        </span>
      ),
      width: '120px'
    },
    {
      key: 'reminder_date_time',
      header: 'Reminder Date',
      render: (value) => (
        <span className="text-[14px] text-[#616161] overflow-hidden font-normal font-family">
          {format(new Date(value), "dd-MM-yy")}
        </span>
      ),
      width: '120px'
    },
    {
      key: 'budget_min',
      header: 'Budget',
      render: (value) => (
        <span className="text-[14px] text-[#616161] overflow-hidden font-normal font-family">
          {value ? `$ ${value}` : '---'}
        </span>
      ),
      width: '100px'
    },
    {
      key: 'condition',
      header: 'Condition',
      render: (value) => (
        <span className="text-[14px] text-[#616161] overflow-hidden font-normal font-family">
          {value || '---'}
        </span>
      ),
      width: '120px'
    },
    {
      key: 'lead_created_by',
      header: 'Created by',
      render: (value) => (
        <span className="text-[14px] text-[#616161] overflow-hidden font-normal font-family">
          {value || '---'}
        </span>
      ),
      width: '120px'
    },
    {
      key: 'actions',
      header: 'Action',
      render: (value, row) => (
        <div className="relative inline-block overflow-visible" ref={openDropdown === row.id ? dropdownRef : null}>
          <button 
            onClick={(event) => toggleDropdown(row.id, event)} 
            className={`dropdown-toggle p-1 rounded ${openDropdown === row.id ? 'bg-gray-100' : ''}`}
          >
            <MoreDotIcon className="text-gray-400 font-family hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          {openDropdown === row.id && (
            <div className={`absolute right-9 ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-[-4px] mt-1'} z-[999] w-40 bg-white shadow-md border rounded-sm`}>
              <DropdownItem
                onItemClick={() => {
                  hanldeViewDetails(row.id);
                  closeDropdown();
                }}
                className="flex w-full font-normal px-4 text-[12px] border-b border-[#E9E9E9] text-[#414141]"
              >
                View Details
              </DropdownItem>
              {row.type === 'lead' && (
                <DropdownItem
                  onItemClick={() => hanldeViewDetails(row.id)}
                  className="flex w-full font-normal !px-4 text-[12px] font-family border-b border-[#E9E9E9] text-[#414141]"
                >
                  Edit
                </DropdownItem>
              )}
              <DropdownItem
                onItemClick={() => {
                  setSelectedId(row.id);
                  setSelectedListingNumber(row.listing_number);
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
      ),
      width: '80px'
    }
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={data?.leads?.data || []}
        loading={isLoading}
        searchable={true}
        searchPlaceholder="Search investor leads..."
        pagination={true}
        currentPage={currentPage}
        totalPages={data?.leads?.last_page || 1}
        perPage={perPage}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
        maxHeight="calc(100vh - 130px)"
        minHeight="600px"
        emptyMessage="No investor leads found"
        loadingMessage="Loading investor leads..."
        actions={
          <Button variant="primary" size='sm' onClick={handleNavigate}>
            Add New Lead
          </Button>
        }
        responsive={true}
        stickyHeader={true}
      />

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

export default InvestorLeadsTable;