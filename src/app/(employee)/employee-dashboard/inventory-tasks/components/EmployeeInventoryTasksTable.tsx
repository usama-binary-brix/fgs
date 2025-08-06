"use client";

import { useState } from 'react';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { MoreDotIcon } from '@/icons';
import { IoSearchOutline } from 'react-icons/io5'

import { useAddInvestmentMutation, useDeleteInventoryMutation, useGetAllEmployeeInventoryQuery, useGetAllInventoryQuery } from '@/store/services/api';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { toast } from 'react-toastify';

import { useRouter } from 'next/navigation';
import AddLeadInput from '@/app/(admin)/dashboard/leads/components/input/AddLeadInput';
import { useFormik } from 'formik';
import { useDebounce } from 'use-debounce';
import Pagination from '@/components/tables/Pagination';
import NProgress from 'nprogress';
import DataTable from '@/components/ui/DataTable';


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

const EmployeeInventoryTasksTable = () => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom');
    const [searchText, setSearchText] = useState('');
    const [debouncedSearchText] = useDebounce(searchText, 800);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10); // Example total pages
    const [perPage, setPerPage] = useState(10);

    const { data, isLoading, error, refetch } = useGetAllEmployeeInventoryQuery({
        page: currentPage,
        perPage: perPage,
        search: debouncedSearchText
    });

    // const { data, isLoading, error } = useGetAllInventoryQuery('');
    const router = useRouter()
    const [addInvestment] = useAddInvestmentMutation()
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
    const handleCloseModal = () => {
        setIsOpen(false);
    };
    const [isOpen, setIsOpen] = useState(false);

    const [openDropdownId, setOpenDropdownId] = useState<string | number | null>();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | number | null>(null);
    const handleNavigate = (id: any) => {
             NProgress.start();
        
        router.push(`view-tasks/${id}`)
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


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePerPageChange = (newPerPage: number) => {
        setPerPage(newPerPage);
        setCurrentPage(1); // Reset to first page on per-page change
    };

    const columns = [
        { key: 'listing_number', header: 'ID' },
        { key: 'make', header: 'ELEVATOR MANUFACTURER' },
        { key: 'model', header: 'ELEVATOR MODEL' },
        { key: 'serial_no', header: 'ELEVATOR SERIAL' },
        {
            key: 'task_status',
            header: 'STATUS',
            render: (value:any, row:any) => (
                <span className={`px-3 py-2 rounded-md text-sm font-medium ${
                    value === 'active'
                        ? 'bg-orange-100 text-orange-500'
                        : value === 'completed'
                            ? 'bg-green-100 text-green-600'
                            : value === 'pending'
                                ? 'bg-[#8E7F9C1F] text-[#8E7F9C]'
                                : ''
                }`}>
                    {value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Pending'}
                </span>
            )
        },
        {
            key: 'actions',
            header: 'ACTION',
            render: (value:any, row:any) => (
                <button
                    onClick={() => handleNavigate(row.id)}
                    className="dropdown-toggle p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 underline rounded"
                >
                    View Details
                </button>
            )
        }
    ];

    return (
        <div className=''>
            <DataTable
                columns={columns}
                data={data?.inventories?.data || []}
                loading={isLoading}
                currentPage={currentPage}
                totalPages={data?.inventories?.last_page || 1}
                perPage={perPage}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
                onSearch={setSearchText}
                searchPlaceholder="Search"
                emptyMessage="No inventories found"
            />
        </div>
    );
};

export default EmployeeInventoryTasksTable;

