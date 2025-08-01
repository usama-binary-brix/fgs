"use client";

import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import { MoreDotIcon } from '@/icons';
import Button from '@/components/ui/button/Button';
import { useDeleteInventoryMutation, useGetAllInventoryQuery } from '@/store/services/api';
import { toast } from 'react-toastify';
import AddInventoryModal from '../AddInventoryModal';
import InvestorRequestModal from '../InvestorRequestModal';
import TotalInvestorsModal from '../TotalInvestorsModal';
import { useRouter } from 'next/navigation';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { useDebounce } from 'use-debounce';
import NProgress from 'nprogress';
import DataTable, { DataTableColumn } from '@/components/ui/DataTable';

const InventoryTable = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom');
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText] = useDebounce(searchText, 800);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { data, isLoading, error, refetch } = useGetAllInventoryQuery({
    page: currentPage,
    perPage: perPage,
    search: debouncedSearchText
  });
  
  const router = useRouter()
  
  useEffect(() => {
    refetch()
  }, [refetch])

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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // INVRequest Modal
  const [isInvReqModalOpen, setIsInvReqModalOpen] = useState(false);
  const [selectedInventoryId, setSelectedInventoryId] = useState<number | null>(null);

  const handleOpenInvReqModal = (InventoryId: any, listingNumber: any) => {
    setSelectedListingNumber(listingNumber)
    setSelectedInventoryId(InventoryId);
    setIsInvReqModalOpen(true);
  };

  const handleCloseInvReqModal = () => {
    setIsInvReqModalOpen(false);
    setSelectedInventoryId(null);
  };

  // totalInvestorsModal
  const [isTotalInvModalOpen, setIsTotalInvModalOpen] = useState(false);

  const handleOpenTotalInvModal = (InventoryId: any) => {
    setIsTotalInvModalOpen(true);
    setSelectedId(InventoryId)
  };

  const handleCloseTotalInvModal = () => {
    setIsTotalInvModalOpen(false);
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [selectedListingNumber, setSelectedListingNumber] = useState<string | number | null>(null);

  const [deleteInventory, { isLoading: isDeleting }] = useDeleteInventoryMutation();

  const handleDeleteInventory = async (inventoryId: string | number | null) => {
    try {
      await deleteInventory(inventoryId).unwrap();
      toast.success('Inventory deleted successfully!');
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
    setCurrentPage(1);
  };

  const handleSearch = (searchText: string) => {
    setSearchText(searchText);
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

  // Define table columns
  const columns: DataTableColumn[] = [
    {
      key: 'listing_number',
      header: 'ID',
      render: (value, row) => (
        <span className="text-[#616161] text-[14px] font-family text-start overflow-hidden">
          {value}
        </span>
      ),
      width: '80px'
    },
    {
      key: 'status',
      header: 'STATUS',
      render: (value, row) => (
        <span className="px-1 py-2 text-xs">
          {value ? (
            <span
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                value === 'in_progress'
                  ? 'bg-orange-100 text-orange-500'
                  : value === 'complete'
                  ? 'bg-green-100 text-green-600'
                  : value === 'pending'
                  ? 'bg-[#8e7f9c1f] font-family text-[14px] font-medium text-[#8E7F9C]'
                  : ''
              }`}
            >
              {value
                .split('_')
                .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </span>
          ) : (
            <span className={`px-3 py-2 rounded-md text-sm font-medium bg-[#8E7F9C1F] text-[#8E7F9C]`}>
              Pending
            </span>
          )}
        </span>
      ),
      width: '120px'
    },
    {
      key: 'make',
      header: 'ELEVATOR MANUFACTURER',
      render: (value) => (
        <span className="text-[#616161] text-[14px] font-family text-start">
          {value}
        </span>
      ),
      width: '180px'
    },
    {
      key: 'model',
      header: 'ELEVATOR MODEL',
      render: (value) => (
        <span className="text-[#616161] text-[14px] font-family text-start">
          {value}
        </span>
      ),
      width: '150px'
    },
    {
      key: 'serial_no',
      header: 'ELEVATOR SERIAL',
      render: (value) => (
        <span className="text-[#616161] text-[14px] font-family text-start">
          {value}
        </span>
      ),
      width: '150px'
    },
    {
      key: 'date_purchased',
      header: 'PURCHASE DATE',
      render: (value) => (
        <span className="text-[#616161] text-[14px] font-family text-start">
          {value}
        </span>
      ),
      width: '120px'
    },
    {
      key: 'price_paid',
      header: 'PURCHASE PRICE',
      render: (value) => (
        <span className="text-[#616161] text-[14px] font-family text-start">
          $ {value || '---'}
        </span>
      ),
      width: '120px'
    },
    {
      key: 'reconditioning',
      header: 'RECONDITIONING %',
      render: (value) => (
        <span className="text-[#616161] text-[14px] font-family text-start">
          {value || '---'}
        </span>
      ),
      width: '140px'
    },
    {
      key: 'completionDate',
      header: 'COMPLETION DATE',
      render: (value) => (
        <span className="text-[#616161] text-[14px] font-family text-start">
          {value || '---'}
        </span>
      ),
      width: '140px'
    },
    {
      key: 'inv_requests',
      header: 'INV. REQUESTS',
      render: (value, row) => (
        <div className="flex justify-center relative">
          {row.total_investors > 0 ? (
            <>
              <svg
                onClick={() => handleOpenInvReqModal(row.id, row.listing_number)}
                xmlns="http://www.w3.org/2000/svg"
                className="border cursor-pointer border-[#D1842880] bg-[#D184281A] rounded-md"
                width="26"
                height="26"
                viewBox="0 0 21 20"
                fill="none"
              >
                <path
                  d="M10.5001 2.1998V17.7998"
                  stroke="#D18428"
                  strokeWidth="1.3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                />
                <path
                  d="M9.63345 10.0002H11.3668C12.8027 10.0002 13.9668 11.1643 13.9668 12.6002C13.9668 14.0361 12.8027 15.2002 11.3668 15.2002H9.63345C8.19751 15.2002 7.03345 14.0361 7.03345 12.6002"
                  stroke="#D18428"
                  strokeWidth="1.3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                />
                <path
                  d="M11.3668 10H9.63345C8.19751 10 7.03345 8.83594 7.03345 7.4C7.03345 5.96406 8.19751 4.8 9.63345 4.8H11.3668C12.8027 4.8 13.9668 5.96406 13.9668 7.4"
                  stroke="#D18428"
                  strokeWidth="1.3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute top-[-9px] border border-[#D18428] bg-[#D18428] rounded-full px-1 right-12">
                <h1 className="text-xs text-white">{row.total_investors}</h1>
              </div>
            </>
          ) : (
            <svg
              onClick={() => toast.warning("No investment available")}
              xmlns="http://www.w3.org/2000/svg"
              className="border cursor-pointer border-[#D1842880] bg-[#D184281A] rounded"
              width="25"
              height="25"
              viewBox="0 0 21 20"
              fill="none"
            >
              <path
                d="M10.5001 2.1998V17.7998"
                stroke="#D18428"
                strokeWidth="1.3"
                strokeMiterlimit="10"
                strokeLinecap="round"
              />
              <path
                d="M9.63345 10.0002H11.3668C12.8027 10.0002 13.9668 11.1643 13.9668 12.6002C13.9668 14.0361 12.8027 15.2002 11.3668 15.2002H9.63345C8.19751 15.2002 7.03345 14.0361 7.03345 12.6002"
                stroke="#D18428"
                strokeWidth="1.3"
                strokeMiterlimit="10"
                strokeLinecap="round"
              />
              <path
                d="M11.3668 10H9.63345C8.19751 10 7.03345 8.83594 7.03345 7.4C7.03345 5.96406 8.19751 4.8 9.63345 4.8H11.3668C12.8027 4.8 13.9668 5.96406 13.9668 7.4"
                stroke="#D18428"
                strokeWidth="1.3"
                strokeMiterlimit="10"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
      ),
      width: '120px'
    },
    {
      key: 'total_investors',
      header: 'TOTAL INVESTORS',
      render: (value, row) => (
        <span 
          onClick={() => handleOpenTotalInvModal(row.id)} 
          className='border-b cursor-pointer border-gray-400 text-[#616161] text-[14px] font-family text-center'
        >
          {value}
        </span>
      ),
      width: '120px'
    },
    {
      key: 'total_investment',
      header: 'INVESTMENT AMOUNT',
      render: (value) => (
        <span className="text-[#616161] text-[14px] font-family text-start">
          {value || '---'}
        </span>
      ),
      width: '140px'
    },
    {
      key: 'selling_price',
      header: 'SALE PRICE',
      render: (value) => (
        <span className="text-[#616161] text-[14px] font-family text-start">
          {value || '---'}
        </span>
      ),
      width: '120px'
    },
    {
      key: 'profitAmt',
      header: 'PROFIT AMT',
      render: (value) => (
        <span className="text-[#616161] text-[14px] font-family text-start">
          {value || '---'}
        </span>
      ),
      width: '120px'
    },
    {
      key: 'profit',
      header: 'PROFIT %',
      render: (value) => (
        <span className="text-[#616161] text-[14px] font-family text-start">
          {value || '---'}
        </span>
      ),
      width: '100px'
    },
    {
      key: 'actions',
      header: 'ACTION',
      render: (value, row) => (
        <div className="relative inline-block" ref={openDropdown === row.id ? dropdownRef : null}>
          <button
            onClick={(e) => toggleDropdown(row.id, e)}
            className={`dropdown-toggle p-1 rounded ${openDropdown === row.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>

          {openDropdown === row.id && (
            <div className={`absolute right-9 ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-[-7px] mt-2'} z-[999] w-40 bg-white p-2 shadow-md border rounded-sm`}>
              <DropdownItem
                onItemClick={() => {
                  NProgress.start();
                  router.push(`/dashboard/view-inventory/${row.id}`);
                  closeDropdown();
                }}
                className="flex w-full text-left text-[12px] font-family text-[#414141] font-normal border-b border-[#E9E9E9] rounded dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                View Details
              </DropdownItem>

              <DropdownItem
                onItemClick={() => {
                  NProgress.start();
                  router.push(`/dashboard/edit-inventory/${row.id}`);
                  closeDropdown();
                }}
                className="flex w-full text-left text-[12px] font-family text-[#414141] font-normal border-b border-[#E9E9E9] rounded dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Edit
              </DropdownItem>

              {row?.selling_price == null && (
                <DropdownItem
                  onItemClick={() => {
                    setSelectedId(row.id);
                    setSelectedListingNumber(row.listing_number);
                    setIsDeleteModalOpen(true);
                    closeDropdown();
                  }}
                  className="flex w-full text-left text-[12px] font-family text-[#414141] font-normal rounded dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  Delete
                </DropdownItem>
              )}
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
        data={data?.inventories?.data || []}
        loading={isLoading}
        searchable={true}
        searchPlaceholder="Search inventory..."
        pagination={true}
        currentPage={currentPage}
        totalPages={data?.inventories?.last_page || 1}
        perPage={perPage}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
        maxHeight="calc(100vh - 130px)"
        minHeight="600px"
        emptyMessage="No inventory found"
        loadingMessage="Loading inventory..."
        actions={
          <Button variant="primary" size='sm' onClick={handleOpenModal}>
            Add New Inventory
          </Button>
        }
        responsive={true}
        stickyHeader={true}
      />

      <AddInventoryModal open={isModalOpen} onClose={handleCloseModal} />
      <InvestorRequestModal open={isInvReqModalOpen} onClose={handleCloseInvReqModal} InventoryId={selectedInventoryId} listingNumber={selectedListingNumber} />
      <TotalInvestorsModal open={isTotalInvModalOpen} onClose={handleCloseTotalInvModal} InventoryId={selectedId} />

      <DeleteConfirmationModal
        title={'Inventory'}
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => handleDeleteInventory(selectedId)}
        name={selectedListingNumber}
      />
    </>
  );
};

export default InventoryTable;

