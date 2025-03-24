"use client";

import { useState } from 'react';
import TopButtons from '@/components/Buttons/TopButtons';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { MoreDotIcon } from '@/icons';
import { IoSearchOutline } from 'react-icons/io5'
import InventoryModal from '../addinventory/page';
import InvRequestModal from '../invrequestsmodal/page';
import TotalInvModal from '../totalinvestorsmodal/page';
import { useDeleteInventoryMutation, useGetAllInventoryQuery } from '@/store/services/api';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { toast } from 'react-toastify';



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
  const { data, isLoading, error } = useGetAllInventoryQuery('');


  const toggleDropdown = (id: string) => {
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
    const [deleteInventory, { isLoading: isDeleting }] = useDeleteInventoryMutation();
  
      const handleDeleteInventory = async (inventoryId:string | number | null) => {
        try {
          await deleteInventory(inventoryId).unwrap();
          toast.success('Inventory deleted successfully!');
        } catch (error) {
          toast.error('Failed to delete inventory!');
        } finally {
          setIsDeleteModalOpen(false); 
        }
      };
     

  return (
    <>
<div className=''>
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
          <TopButtons onClick={handleOpenModal} label="Add New Inventory" variant="primary" />
        </div>
        <InventoryModal open={isModalOpen} onClose={handleCloseModal} />
      </div>


      <div className="rounded-xl border  border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className=" overflow-auto">
          <Table className='table-auto'>
            <TableHeader className="border-b bg-[#F5F5F5] border-gray-100 dark:border-white/[0.05]">
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
              {data?.inventories?.map((lead: any) => (
                <TableRow key={lead.id}>
                  <TableCell className="px-5 py-4 text-gray-500 text-xs text-start whitespace-nowrap overflow-hidden">{lead.id}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-xs text-start">{lead.make}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-xs text-start">{lead.model}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-xs text-start">{lead.serial_no}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-xs text-start">{lead.date_purchased}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-xs text-start">{lead.price_paid || '---'}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-xs text-start">{lead.reconditioning || '---'}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-xs text-start">{lead.completionDate || '---'}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-xs text-start">
                    <div className='flex justify-center relative'>
                      <svg onClick={handleOpenInvReqModal} xmlns="http://www.w3.org/2000/svg" className='border cursor-pointer border-[#D1842880] bg-[#D184281A]  rounded' width="25" height="25" viewBox="0 0 21 20" fill="none">
                        <path d="M10.5001 2.1998V17.7998" stroke="#D18428" stroke-width="1.3" stroke-miterlimit="10" stroke-linecap="round" />
                        <path d="M9.63345 10.0002H11.3668C12.8027 10.0002 13.9668 11.1643 13.9668 12.6002C13.9668 14.0361 12.8027 15.2002 11.3668 15.2002H9.63345C8.19751 15.2002 7.03345 14.0361 7.03345 12.6002" stroke="#D18428" stroke-width="1.3" stroke-miterlimit="10" stroke-linecap="round" />
                        <path d="M11.3668 10H9.63345C8.19751 10 7.03345 8.83594 7.03345 7.4C7.03345 5.96406 8.19751 4.8 9.63345 4.8H11.3668C12.8027 4.8 13.9668 5.96406 13.9668 7.4" stroke="#D18428" stroke-width="1.3" stroke-miterlimit="10" stroke-linecap="round" />
                      </svg>
                      <div className='absolute top-[-9px] border border-[#D18428] bg-[#D18428] rounded-full px-1 right-7'>
                        <h1 className='text-xs  text-white'>2</h1>
                      </div>
                    </div>

 
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-xs  text-center"><span onClick={handleOpenTotalInvModal} className='border-b cursor-pointer  border-gray-400'>{lead.totalInvestors}</span></TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-xs text-start">{lead.investmentAmount || '---'}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500  text-xs text-start">{lead.salePrice || '---'}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-xs text-start">{lead.profitAmt || '---'}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-xs text-start">{lead.profit || '---'}</TableCell>
                  {lead.status ? (
                    <TableCell className="px-5 py-4 text-xs">
                      <span
                        className={`px-3 py-1 rounded-md text-sm font-medium ${lead.status === 'in progress'
                          ? 'bg-orange-100 text-orange-500'
                          : lead.status === 'sold'
                            ? 'bg-green-100 text-green-600'
                            : lead.status === 'pending'
                              ? 'bg-[#8E7F9C1F] text-[#8E7F9C]'
                              : ''
                          }`}
                      >
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)} {/* Capitalize */}
                      </span>
                    </TableCell>
                  ) : (
                    <TableCell className="px-5 py-4 text-gray-500 text-xs text-start">
                      <span
                        className={`px-3 py-2 rounded-md text-sm font-medium bg-[#8E7F9C1F] text-[#8E7F9C]`}
                      >
                        Pending
                      </span>
                    </TableCell>
                  )}
                  <TableCell className="px-5 py-4 text-xs text-start">
                    <div className="relative inline-block">
                      <button onClick={() => toggleDropdown(lead.id)} className="dropdown-toggle">
                        <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                      </button>
                      <Dropdown isOpen={openDropdown === lead.id} onClose={closeDropdown} className="w-40 p-2">
                        <DropdownItem onItemClick={closeDropdown} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                          View More
                        </DropdownItem>
                        <DropdownItem   onItemClick={() => {
    setOpenDropdownId(null);
    setSelectedId(lead.id);
    setIsDeleteModalOpen(true); 
  }} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
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
      </div>
      <InvRequestModal open={isInvReqModalOpen} onClose={handleCloseInvReqModal} />
      <TotalInvModal open={isTotalInvModalOpen} onClose={handleCloseTotalInvModal} />
      <Dialog
  open={isDeleteModalOpen}
  onClose={() => setIsDeleteModalOpen(false)}
>
  <DialogTitle>Remove Inventory</DialogTitle>
  <DialogContent>
    <Typography>Are you sure you want to remove this inventory. </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setIsDeleteModalOpen(false)}  sx={{color:"#D18428", border:'1px solid #D18428', paddingX:'1rem', textTransform:'none'}}>
      Cancel
    </Button>
    <Button
    className='bg-primary hover:bg-primary'
      onClick={() => handleDeleteInventory(selectedId)}
      // color="error"
      sx={{backgroundColor:'#D18428',  '&:hover': { backgroundColor: '#D18428' }, textTransform:'none'}}
      variant="contained"
    >
      Remove
    </Button>
    
  </DialogActions>
</Dialog>

    </>
  );
};

export default InventoryTable;

