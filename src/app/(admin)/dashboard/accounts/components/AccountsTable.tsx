'use client'
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { MoreDotIcon } from '@/icons';
import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import { useRef } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import AccountsModal from './AccountsModal';
import { useDeleteUserMutation, useGetAllUsersQuery } from '@/store/services/api';
import { toast } from 'react-toastify';
import { format } from "date-fns";
import { FaUserCircle } from "react-icons/fa";
import ViewAccountDetailsModal from './ViewAcoountDetailsModal';
import Pagination from '@/components/tables/Pagination';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import Button from '@/components/ui/button/Button';
import { useDebounce } from 'use-debounce';

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

  const toggleDropdown = (id: string | number | null) => {
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

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <div className="inline-flex items-center gap-3">
          <div className="hidden sm:block">
            <div className="flex items-center space-x-2">
              <div className="relative">

                <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#616161]" />
                <input
                  className="text-xs border placeholder-[#616161]  bg-white rounded-lg pl-9 pr-2 h-9 w-64 border-[#DDD] font-family font-medium text-[12.5px] text-[#616161] focus:border-gray-400 focus:outline-none"
                  placeholder="Search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>

            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">


          <Button variant="primary" size='sm' onClick={handleOpenModal}>
            Add New Account
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
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full h-[30rem] overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 z-50 border-b bg-[#F7F7F7] border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    {['Name', 'Email', 'Account Type', 'Phone Number', 'Created Date', 'Status', 'Action'].map((heading) => (
                      <TableCell key={heading} isHeader className="px-5 py-3 uppercase text-[#616161] font-medium text-start text-[14px] dark:text-gray-400">
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
                <TableBody className="">
                  {data?.users?.data?.map((user: any, index: any) => (
                    <TableRow key={index}>
                      <TableCell className="px-5 py-2 text-sm flex items-center gap-3">
                        {user.profile_image ? (
                         <Image
                         width={26}
                         height={6}
                         src={user.profile_image || '/fallback-avatar.png'}
                         alt={user.first_name}
                         className="rounded-full w-6 h-6"
                       />
                       
                        ) : (
                          <span>
                            <FaUserCircle className="w-6 h-6 text-gray-500" />

                          </span>
                        )}
                        <span className="font-medium break-words max-w-[150px] overflow-hidden text-ellipsis text-[#616161]">
                          {user.first_name} {user.last_name}
                        </span>

                      </TableCell>

                      <TableCell className="px-5 py-2 text-sm text-[#616161]">{user.email}</TableCell>
                      <TableCell className="px-5 py-2 text-sm text-[#616161]">{user.account_type}</TableCell>
                      <TableCell className="px-5 py-2 text-sm text-[#616161]">{user.phone_number}</TableCell>
                      <TableCell className="px-5 py-2 text-sm text-[#616161]">
                        {format(new Date(user.created_at), "dd-MM-yy")}
                      </TableCell>
                      <TableCell className="px-5 py-2 text-sm text-[#616161]">
                        <span
                          className={`px-2 py-2 rounded-sm text-sm font-medium ${user.status === 'Active'
                            ? 'bg-green-100 px-3 text-green-600'
                            : 'bg-orange-100 text-orange-500'
                            }`}
                        >
                          {user.status}
                        </span>
                      </TableCell>

                      <TableCell className="px-5 py-2 text-sm text-center text-[#616161]">
                        <div className="relative inline-block" ref={openDropdownId === user.id ? dropdownRef : null}>
                          <button onClick={() => toggleDropdown(user.id)} className={`dropdown-toggle p-1 rounded ${openDropdownId === user.id ? 'bg-gray-100' : ''}`}>
                            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                          </button>

                          {openDropdownId === user.id && (
                            <div className="absolute right-9 top-[-7px] mt-2 z-50 w-30 bg-white shadow-md border rounded-sm">
                              <DropdownItem
                                onItemClick={() => {
                                  handleViewMore(user.id);
                                  setOpenDropdownId(null);
                                }}
                                className="flex w-full font-normal px-4 text-[12px] border-b border-[#E9E9E9] text-[#414141]">
                                View Details
                              </DropdownItem>
                              <DropdownItem onItemClick={() => {
                                handleEditUser(user);
                                setOpenDropdownId(null);
                              }}
                                className="flex w-full font-normal px-4 text-[12px] border-b border-[#E9E9E9] text-[#414141]">
                                Edit
                              </DropdownItem>
                              <DropdownItem
                                onItemClick={() => {
                                  setOpenDropdownId(null);
                                  setSelectedUserId(user.id);
                                  setIsDeleteModalOpen(true);
                                  setSelectedName(`${user.first_name}`);
                                  setOpenDropdownId(null);
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
                totalPages={data?.users?.last_page || 1}
                onPageChange={handlePageChange}
                perPage={perPage}
                onPerPageChange={handlePerPageChange}
              />
            </div>

          </div>
        </>
      )}

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
