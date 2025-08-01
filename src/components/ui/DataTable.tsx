'use client'

import React, { ReactNode, useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from './table';
import { IoSearchOutline } from 'react-icons/io5';
import Pagination from '@/components/tables/Pagination';
import Button from './button/Button';

// Types for the DataTable component
export interface DataTableColumn {
  key: string;
  header: string;
  render?: (value: any, row: any, index: number) => ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps {
  columns: DataTableColumn[];
  data: any[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  pagination?: boolean;
  perPageOptions?: number[];
  defaultPerPage?: number;
  maxHeight?: string;
  minHeight?: string;
  className?: string;
  onSearch?: (searchText: string) => void;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  currentPage?: number;
  totalPages?: number;
  perPage?: number;
  totalItems?: number;
  emptyMessage?: string;
  loadingMessage?: string;
  actions?: ReactNode;
  showHeader?: boolean;
  stickyHeader?: boolean;
  responsive?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  loading = false,
  searchable = true,
  searchPlaceholder = "Search...",
  pagination = true,
  perPageOptions = [10, 25, 50, 100],
  defaultPerPage = 10,
  maxHeight = "calc(100vh - 110px)",
  minHeight = "400px",
  className = "",
  onSearch,
  onPageChange,
  onPerPageChange,
  currentPage = 1,
  totalPages = 1,
  perPage = defaultPerPage,
  totalItems = 0,
  emptyMessage = "No data available",
  loadingMessage = "Loading...",
  actions,
  showHeader = true,
  stickyHeader = true,
  responsive = true,
}) => {
  const [searchText, setSearchText] = useState('');
  const [localPerPage, setLocalPerPage] = useState(perPage);
  const [localCurrentPage, setLocalCurrentPage] = useState(currentPage);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(searchText);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText, onSearch]);

  // Sync with external pagination state
  useEffect(() => {
    setLocalCurrentPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setLocalPerPage(perPage);
  }, [perPage]);

  const handlePageChange = (page: number) => {
    setLocalCurrentPage(page);
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handlePerPageChange = (newPerPage: number) => {
    setLocalPerPage(newPerPage);
    setLocalCurrentPage(1);
    if (onPerPageChange) {
      onPerPageChange(newPerPage);
    }
  };

  const renderCell = (column: DataTableColumn, row: any, index: number) => {
    if (column.render) {
      return column.render(row[column.key], row, index);
    }
    return row[column.key] || '';
  };

  return (
    <div className={`w-full flex flex-col ${className}`} style={{ height: 'calc(100vh - 110px)' }}>
      {/* Header Section */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 flex-shrink-0">
          {/* Search */}
          {searchable && (
            <div className="relative w-full sm:w-auto sm:min-w-[300px]">
              <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#616161] text-sm" />
              <input
                className="w-full text-xs border placeholder-[#616161] bg-white rounded-lg pl-9 pr-3 h-9 border-[#DDD] font-family font-medium text-[12.5px] text-[#616161] focus:border-gray-400 focus:outline-none"
                placeholder={searchPlaceholder}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          )}

          {/* Actions */}
          {actions && (
            <div className="flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Table Container - Flex grow to take remaining space */}
      <div className="flex-1 flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        {/* Table Wrapper - Flex grow to take available space */}
        <div className={`flex-1 overflow-auto ${responsive ? 'overflow-x-auto' : ''}`}>
          <Table>
            {/* Table Header */}
            <TableHeader 
              className={`${stickyHeader ? 'sticky top-0 z-50' : ''} border-b bg-[#F7F7F7] border-gray-100 dark:border-white/[0.05]`}
            >
              <TableRow>
                {columns.map((column) => (
                  <TableCell 
                    key={column.key} 
                    isHeader 
                    className="px-5 py-3 uppercase text-[#616161] font-medium text-start text-[14px] dark:text-gray-400 whitespace-nowrap"
                    style={{ width: column.width }}
                  >
                    <div className="w-full flex justify-between items-center">
                      {column.header}
                      {column.sortable && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M4.8513 6.35227C4.63162 6.57194 4.63162 6.9281 4.8513 7.14777C5.07097 7.36743 5.42707 7.36743 5.64675 7.14777L4.8513 6.35227ZM7.49902 4.50002H8.06152C8.06152 4.27251 7.9245 4.0674 7.71427 3.98034C7.50412 3.89327 7.26217 3.9414 7.1013 4.10227L7.49902 4.50002ZM6.93652 13.5C6.93652 13.8107 7.18837 14.0625 7.49902 14.0625C7.80967 14.0625 8.06152 13.8107 8.06152 13.5H6.93652ZM13.1468 11.6477C13.3664 11.4281 13.3664 11.072 13.1468 10.8523C12.9271 10.6326 12.5709 10.6326 12.3513 10.8523L13.1468 11.6477ZM10.499 13.5H9.93652C9.93652 13.7275 10.0736 13.9326 10.2838 14.0197C10.4939 14.1068 10.7359 14.0586 10.8968 13.8977L10.499 13.5ZM11.0615 4.50002C11.0615 4.18936 10.8097 3.93752 10.499 3.93752C10.1884 3.93752 9.93652 4.18936 9.93652 4.50002H11.0615ZM5.64675 7.14777L7.89675 4.89777L7.1013 4.10227L4.8513 6.35227L5.64675 7.14777ZM6.93652 4.50002L6.93652 13.5H8.06152V4.50002H6.93652ZM12.3513 10.8523L10.1013 13.1023L10.8968 13.8977L13.1468 11.6477L12.3513 10.8523ZM11.0615 13.5L11.0615 4.50002H9.93652L9.93652 13.5H11.0615Z" fill="#616161" />
                        </svg>
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell 
                    colSpan={columns.length} 
                    className="px-5 py-8 text-center text-sm text-gray-500"
                  >
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mr-3"></div>
                      {loadingMessage}
                    </div>
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={columns.length} 
                    className="px-5 py-8 text-center text-sm text-gray-500"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <TableCell 
                        key={column.key} 
                        className="px-5 py-2 text-sm text-[#616161] whitespace-nowrap"
                        style={{ width: column.width }}
                      >
                        {renderCell(column, row, index)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination - Always visible at bottom */}
        {pagination && (
          <div className="flex-shrink-0 px-6 border-t bg-white">
            <Pagination
              currentPage={localCurrentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              perPage={localPerPage}
              onPerPageChange={handlePerPageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable; 