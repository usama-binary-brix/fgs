'use client'
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import { MoreDotIcon } from '@/icons';
import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import { useRef } from 'react';
import AccountsModal from './AccountsModal';
import { useDeleteUserMutation, useGetAllUsersQuery } from '@/store/services/api';
import { toast } from 'react-toastify';
import { format } from "date-fns";
import { FaUserCircle } from "react-icons/fa";
import ViewAccountDetailsModal from './ViewAcoountDetailsModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import Button from '@/components/ui/button/Button';
import { useDebounce } from 'use-debounce';
import DataTable, { DataTableColumn } from '@/components/ui/DataTable';

const AccountsTable = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText] = useDebounce(searchText, 800);

  const { data, isLoading, error } = useGetAllUsersQuery({
    page: currentPage,
    perPage: perPage,
    search: debouncedSearchText
  });

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [openDropdownId, setOpenDropdownId] = useState<string | number | null>();
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewMoreOpen, setIsViewMoreOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [selectedName, setSelectedName] = useState("");

  const handleEditUser = (user: any) => {
    setSelectedUserData(user);
    setIsEditModalOpen(true);
  };

  const toggleDropdown = (id: string | number | null, event: React.MouseEvent) => {
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
    if (openDropdownId === id) {
      setOpenDropdownId(null);
    } else {
      setOpenDropdownId(id);
    }
  };

  const handleViewMore = (userId: string | number) => {
    setSelectedUserId(userId);
    setIsViewMoreOpen(true);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteUser = async (userId: string | number | null) => {
    try {
      await deleteUser(userId).unwrap();
      toast.success('User deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete user!');
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

  // Reset to first page when search text changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchText]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!openDropdownId) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownId]);

  // Define table columns
  const columns: DataTableColumn[] = [
    {
      key: 'name',
      header: 'Name',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          {row.profile_image ? (
            <Image
              width={26}
              height={6}
              src={row.profile_image || '/fallback-avatar.png'}
              alt={row.first_name}
              className="rounded-full w-6 h-6"
            />
          ) : (
            <span>
              <FaUserCircle className="w-6 h-6 text-gray-500" />
            </span>
          )}
          <span className="font-medium break-words max-w-[150px] overflow-hidden text-ellipsis text-[#616161]">
            {row.first_name} {row.last_name}
          </span>
        </div>
      ),
      width: '200px'
    },
    {
      key: 'email',
      header: 'Email',
      render: (value) => <span className="text-[#616161]">{value}</span>,
      width: '250px'
    },
    {
      key: 'account_type',
      header: 'Account Type',
      render: (value) => <span className="text-[#616161]">{value}</span>,
      width: '150px'
    },
    {
      key: 'phone_number',
      header: 'Phone Number',
      render: (value) => <span className="text-[#616161]">{value}</span>,
      width: '150px'
    },
    {
      key: 'created_at',
      header: 'Created Date',
      render: (value) => (
        <span className="text-[#616161]">
          {format(new Date(value), "dd-MM-yy")}
        </span>
      ),
      width: '120px'
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <span
          className={`px-2 py-2 rounded-sm text-sm font-medium ${
            value === 'Active'
              ? 'bg-green-100 px-3 text-green-600'
              : 'bg-orange-100 text-orange-500'
          }`}
        >
          {value}
        </span>
      ),
      width: '100px'
    },
    {
      key: 'actions',
      header: 'Action',
      render: (value, row) => (
        <div className="relative inline-block" ref={openDropdownId === row.id ? dropdownRef : null}>
          <button 
            onClick={(event) => toggleDropdown(row.id, event)} 
            className={`dropdown-toggle p-1 rounded ${openDropdownId === row.id ? 'bg-gray-100' : ''}`}
          >
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>

          {openDropdownId === row.id && (
            <div className={`absolute right-9 ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-[-7px] mt-2'} z-50 w-30 bg-white shadow-md border rounded-sm`}>
              <DropdownItem
                onItemClick={() => {
                  handleViewMore(row.id);
                  setOpenDropdownId(null);
                }}
                className="flex w-full font-normal px-4 text-[12px] border-b border-[#E9E9E9] text-[#414141]"
              >
                View Details
              </DropdownItem>
              <DropdownItem 
                onItemClick={() => {
                  handleEditUser(row);
                  setOpenDropdownId(null);
                }}
                className="flex w-full font-normal px-4 text-[12px] border-b border-[#E9E9E9] text-[#414141]"
              >
                Edit
              </DropdownItem>
              <DropdownItem
                onItemClick={() => {
                  setOpenDropdownId(null);
                  setSelectedUserId(row.id);
                  setIsDeleteModalOpen(true);
                  setSelectedName(`${row.first_name}`);
                  setOpenDropdownId(null);
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
        data={data?.users?.data || []}
        loading={isLoading}
        searchable={true}
        searchPlaceholder="Search accounts..."
        pagination={true}
        currentPage={currentPage}
        totalPages={data?.users?.last_page || 1}
        perPage={perPage}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
        maxHeight="calc(100vh - 110px)"
        minHeight="600px"
        emptyMessage="No accounts found"
        loadingMessage="Loading accounts..."
        actions={
          <Button variant="primary" size='sm' onClick={handleOpenModal}>
            Add New Account
          </Button>
        }
        responsive={true}
        stickyHeader={true}
      />

      <DeleteConfirmationModal
        title={'Account'}
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => handleDeleteUser(selectedUserId)}
        name={selectedName}
      />
      <ViewAccountDetailsModal open={isViewMoreOpen} onClose={() => setIsViewMoreOpen(false)} userId={selectedUserId} />
      <AccountsModal open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={selectedUserData} />
      <AccountsModal open={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default AccountsTable;
