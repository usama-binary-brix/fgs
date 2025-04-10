"use client";

import { useState } from 'react';
import TopButtons from '@/components/Buttons/TopButtons';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { MoreDotIcon } from '@/icons';
import { IoSearchOutline } from 'react-icons/io5'

import { useDeleteInventoryMutation, useGetAllInventoryQuery } from '@/store/services/api';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { toast } from 'react-toastify';
// import AddInventoryModal from '../AddInventoryModal';
// import InvestorRequestModal from '../InvestorRequestModal';
// import TotalInvestorsModal from '../TotalInvestorsModal';



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


  return (
    <>
      <div className=''>
        <div className="flex justify-between items-center mb-3">
          <div className="inline-flex items-center gap-3">
            <div className="hidden sm:block">
              <div className="flex items-center space-x-2">

                <div className="relative">

                  <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#616161]" />
                  <input
                    className="text-xs border bg-white rounded-lg pl-9 pr-2 h-9 w-64 border-[#DDD] font-family font-medium text-[12.5px] text-[#616161] focus:border-gray-400 focus:outline-none"
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
          {/* <AddInventoryModal open={isModalOpen} onClose={handleCloseModal} /> */}

        </div>


        <div className="rounded-xl border  border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className=" overflow-auto">
            <Table className='table-auto'>
              <TableHeader className="border-b bg-[#F5F5F5] text-[#616161] font-family font-medium text-[12.5px] border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {[
                    'ID', 'ELEVATOR MANUFACTURER', 'ELEVATOR MODEL', 'ELEVATOR SERIAL', 'PURCHASE DATE',
                    'PURCHASE PRICE', 'RECONDITIONING %', 'COMPLETION DATE', 'INV. REQUESTS', 'TOTAL INVESTORS',
                    'INVESTMENT AMOUNT', 'SALE PRICE', 'PROFIT AMT', 'PROFIT %', 'STATUS', 'ACTION'
                  ].map((heading) => (
                    <TableCell key={heading} isHeader className="px-5 py-3 whitespace-nowrap overflow-hidden font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400">
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

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {data?.inventories?.map((lead: any) => (
                  <TableRow key={lead.id}>
                    <TableCell className="px-5 py-4 text-[#616161]  text-[14px] font-family text-start whitespace-nowrap overflow-hidden">{lead.id}</TableCell>
                    <TableCell className="px-5 py-4 text-[#616161] whitespace-nowrap text-[14px] font-family  text-start">{lead.make}</TableCell>
                    <TableCell className="px-5 py-4 text-[#616161] whitespace-nowrap text-[14px] font-family  text-start">{lead.model}</TableCell>
                    <TableCell className="px-5 py-4 text-[#616161] whitespace-nowrap text-[14px] font-family  text-start">{lead.serial_no}</TableCell>
                    <TableCell className="px-5 py-4 text-[#616161] whitespace-nowrap text-[14px] font-family  text-start">{lead.date_purchased}</TableCell>
                    <TableCell className="px-5 py-4 text-[#616161] whitespace-nowrap text-[14px] font-family  text-start">{lead.price_paid || '---'}</TableCell>
                    <TableCell className="px-5 py-4 text-[#616161] whitespace-nowrap text-[14px] font-family text-start">{lead.reconditioning || '---'}</TableCell>
                    <TableCell className="px-5 py-4 text-[#616161] whitespace-nowrap text-[14px] font-family text-start">{lead.completionDate || '---'}</TableCell>
                    <TableCell className="px-5 py-4 text-[#616161] whitespace-nowrap font-family text-start">
                      <div className='flex justify-center relative'>
                        <svg onClick={handleOpenInvReqModal} xmlns="http://www.w3.org/2000/svg" className='border cursor-pointer border-[#D1842880] bg-[#D184281A]  rounded' width="25" height="25" viewBox="0 0 21 20" fill="none">
                          <path d="M10.5001 2.1998V17.7998" stroke="#D18428" stroke-width="1.3" stroke-miterlimit="10" stroke-linecap="round" />
                          <path d="M9.63345 10.0002H11.3668C12.8027 10.0002 13.9668 11.1643 13.9668 12.6002C13.9668 14.0361 12.8027 15.2002 11.3668 15.2002H9.63345C8.19751 15.2002 7.03345 14.0361 7.03345 12.6002" stroke="#D18428" stroke-width="1.3" stroke-miterlimit="10" stroke-linecap="round" />
                          <path d="M11.3668 10H9.63345C8.19751 10 7.03345 8.83594 7.03345 7.4C7.03345 5.96406 8.19751 4.8 9.63345 4.8H11.3668C12.8027 4.8 13.9668 5.96406 13.9668 7.4" stroke="#D18428" stroke-width="1.3" stroke-miterlimit="10" stroke-linecap="round" />
                        </svg>
                        <div className='absolute top-[-9px] border border-[#D18428] bg-[#D18428] rounded-full px-1 right-10'>
                          <h1 className='text-xs  text-white'>2</h1>
                        </div>
                      </div>


                    </TableCell>
                    <TableCell className="px-5 py-4 text-[#616161] text-[14px] font-family  text-center"><span onClick={handleOpenTotalInvModal} className='border-b cursor-pointer  border-gray-400'>{lead.totalInvestors}</span></TableCell>
                    <TableCell className="px-5 py-4 text-[#616161] text-[14px] font-family text-start">{lead.investmentAmount || '---'}</TableCell>
                    <TableCell className="px-5 py-4 text-[#616161] text-[14px] font-family text-start">{lead.salePrice || '---'}</TableCell>
                    <TableCell className="px-5 py-4 text-[#616161] text-[14px] font-family text-start">{lead.profitAmt || '---'}</TableCell>
                    <TableCell className="px-5 py-4 text-[#616161] text-[14px] font-family text-start">{lead.profit || '---'}</TableCell>
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
                      <TableCell className="px-5 py-4 text-[#616161] text-[14px] font-familytext-start">
                        <span
                          className={`px-3 py-2 rounded-md text-sm font-medium bg-[#8E7F9C1F] text-[#8E7F9C]`}
                        >
                          Pending
                        </span>
                      </TableCell>
                    )}
                    <TableCell className="px-5 py-4 text-[#616161] text-[14px] font-family text-start">
                      <div className="relative inline-block">
                        <button onClick={() => toggleDropdown(lead.id)} className="dropdown-toggle">
                          <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                        </button>
                        <Dropdown isOpen={openDropdown === lead.id} onClose={closeDropdown} className="w-40 p-2">
                          <DropdownItem onItemClick={closeDropdown} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                            View More
                          </DropdownItem>
                          <DropdownItem onItemClick={() => {
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
      {/* <InvestorRequestModal open={isInvReqModalOpen} onClose={handleCloseInvReqModal}/>
      <TotalInvestorsModal open={isTotalInvModalOpen} onClose={handleCloseTotalInvModal}/> */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <DialogTitle>Remove Inventory</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to remove this inventory. </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteModalOpen(false)} sx={{ color: "#D18428", border: '1px solid #D18428', paddingX: '1rem', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            className='bg-primary hover:bg-primary'
            onClick={() => handleDeleteInventory(selectedId)}
            // color="error"
            sx={{ backgroundColor: '#D18428', '&:hover': { backgroundColor: '#D18428' }, textTransform: 'none' }}
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

