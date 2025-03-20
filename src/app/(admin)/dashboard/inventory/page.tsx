"use client";

import { useState } from 'react';
import TopButtons from '@/components/Buttons/TopButtons';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { MoreDotIcon } from '@/icons';
import Image from 'next/image';
import { IoSearchOutline } from 'react-icons/io5'


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

const inventoryData: Lead[] = [
  { id: 'EP-73921', elevatorManufacturer: 'Hoist', elevatorModel: 'C25L', elevatorSerial: 'C09701', purchaseDate: '02-26-2024', purchasePrice: '$ 2170.00', reconditioning: '45%', completionDate: '---', invRequests: 'Arcangelo', totalInvestors: '1', investmentAmount: '$ 2921.00', salePrice: '---', profitAmt: '---', profit: '---', },
  { id: 'EP-74321', elevatorManufacturer: 'Hoist', elevatorModel: 'C25L', elevatorSerial: 'C09701', purchaseDate: '02-26-2024', purchasePrice: '$ 2170.00', reconditioning: '45%', completionDate: '---', invRequests: 'Arcangelo', totalInvestors: '1', investmentAmount: '$ 2921.00', salePrice: '---', profitAmt: '---', profit: '---', },
  { id: 'EP-73451', elevatorManufacturer: 'Hoist', elevatorModel: 'C25L', elevatorSerial: 'C09701', purchaseDate: '02-26-2024', purchasePrice: '$ 2170.00', reconditioning: '45%', completionDate: '---', invRequests: 'Arcangelo', totalInvestors: '1', investmentAmount: '$ 2921.00', salePrice: '---', profitAmt: '---', profit: '---', },

];

const InventoryTable = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);


  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };


  return (
    <>
      <div className='mb-5'>
        <h1 className='text-xl font-bold text-black'>All Inventory</h1>
      </div>
      <div className="flex justify-between items-center mb-3">
        <div className="inline-flex items-center gap-3">
          <div className="hidden sm:block">
            <div className="flex items-center space-x-2">

              <div className="relative">

                <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  className="text-xs border rounded-lg pl-9 pr-2 h-9 w-64 border-gray-300 focus:border-gray-400 focus:outline-none"
                  placeholder="Search"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <TopButtons label="Edit Columns" variant="outlined" />
          <TopButtons label="Filters" variant="outlined" />
          <TopButtons label="Add New Account" variant="primary" />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b bg-header border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {[
                  'ID', 'ELEVATOR MANUFACTURER', 'ELEVATOR MODEL', 'ELEVATOR SERIAL', 'PURCHASE DATE',
                  'PURCHASE PRICE', 'RECONDITIONING %', 'COMPLETION DATE', 'INV. REQUESTS', 'TOTAL INVESTORS',
                  'INVESTMENT AMOUNT', 'SALE PRICE', 'PROFIT AMT', 'PROFIT %', 'STATUS', 'ACTION'
                ].map((heading) => (
                  <TableCell key={heading} isHeader className="px-5 py-3 whitespace-nowrap overflow-hidden font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {heading}

                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {inventoryData.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="px-5 py-4 text-gray-500 text-xs text-start whitespace-nowrap overflow-hidden">{lead.id}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-xs text-start">{lead.elevatorManufacturer}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-xs text-start">{lead.elevatorModel}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-xs text-start">{lead.elevatorSerial}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-xs text-start">{lead.purchaseDate}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-xs text-start">{lead.purchasePrice}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-xs text-start">{lead.reconditioning}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-xs text-start">{lead.completionDate}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-xs text-start">
                   <span className=''>
                   <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                      <path d="M10.5001 2.1998V17.7998" stroke="#D18428" stroke-width="1.3" stroke-miterlimit="10" stroke-linecap="round" />
                      <path d="M9.63345 10.0002H11.3668C12.8027 10.0002 13.9668 11.1643 13.9668 12.6002C13.9668 14.0361 12.8027 15.2002 11.3668 15.2002H9.63345C8.19751 15.2002 7.03345 14.0361 7.03345 12.6002" stroke="#D18428" stroke-width="1.3" stroke-miterlimit="10" stroke-linecap="round" />
                      <path d="M11.3668 10H9.63345C8.19751 10 7.03345 8.83594 7.03345 7.4C7.03345 5.96406 8.19751 4.8 9.63345 4.8H11.3668C12.8027 4.8 13.9668 5.96406 13.9668 7.4" stroke="#D18428" stroke-width="1.3" stroke-miterlimit="10" stroke-linecap="round" />
                    </svg>
                   </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-xs  text-start"><span className='border-b  border-gray-400'>{lead.totalInvestors}</span></TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-xs text-start">{lead.investmentAmount}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500  text-xs text-start">{lead.salePrice}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-xs text-start">{lead.profitAmt}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-xs text-start">{lead.profit}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-xs text-start">
                    <button className="border-1 text-gray-500 border-gray-300 rounded-lg p-2">Pending</button>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-xs text-start">
                    <div className="relative inline-block">
                      <button onClick={() => toggleDropdown(lead.id)} className="dropdown-toggle">
                        <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                      </button>
                      <Dropdown isOpen={openDropdown === lead.id} onClose={closeDropdown} className="w-40 p-2">
                        <DropdownItem onItemClick={closeDropdown} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                          View More
                        </DropdownItem>
                        <DropdownItem onItemClick={closeDropdown} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                          Delete
                        </DropdownItem>
                      </Dropdown>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default InventoryTable;

