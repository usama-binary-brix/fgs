'use client'
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  perPage,
  onPerPageChange,
}) => {
  // Calculate visible page numbers
  const getVisiblePages = () => {
    const visiblePages = [];
    const maxVisible = 3; // Number of pages to show around current
    
    // Always show first page
    if (currentPage > 2 && totalPages > 3) {
      visiblePages.push(1);
      if (currentPage > 3) {
        visiblePages.push('...');
      }
    }

    // Calculate range around current page
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, currentPage + 1);

    // Adjust if near start or end
    if (currentPage <= 2) {
      end = Math.min(3, totalPages);
    }
    if (currentPage >= totalPages - 1) {
      start = Math.max(1, totalPages - 2);
    }

    for (let i = start; i <= end; i++) {
      if (!visiblePages.includes(i)) {
        visiblePages.push(i);
      }
    }

    // Always show last page if not already shown
    if (end < totalPages) {
      if (end < totalPages - 1) {
        visiblePages.push('...');
      }
      visiblePages.push(totalPages);
    }

    return visiblePages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex justify-between flex-col lg:flex-row mt-6 lg:mt-0 items-center">
      <div className="flex items-center space-x-2 text-gray-600">
        <span className="text-sm font-medium">Rows per page</span>
        <select
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
          className="border px-2 py-1 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          {[1, 5, 10, 20, 50].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      <span className="text-sm font-medium">OF {totalPages}</span>

      </div>
      
      <div className="flex items-center my-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="mr-2.5 flex items-center h-10 justify-center rounded-md border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] text-sm"
        >
          <IoIosArrowBack /> Previous
        </button>
        
        <div className="flex items-center gap-2">
          {visiblePages.map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2">...</span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={`px-4 py-2 rounded ${
                  currentPage === page
                    ? "bg-primary/20 text-primary"
                    : "text-gray-700 dark:text-gray-400"
                } flex w-10 items-center justify-center h-10 rounded-md text-sm font-medium hover:bg-blue-500/[0.08] hover:text-brand-500 dark:hover:text-brand-500`}
              >
                {page}
              </button>
            )
          ))}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-2.5 flex items-center justify-center rounded-md border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs text-sm hover:bg-gray-50 h-10 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
        >
          Next <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
};

export default Pagination;