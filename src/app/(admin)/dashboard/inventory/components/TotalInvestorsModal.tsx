import React, { useState } from 'react'
import {
  Modal,
  Box,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
} from '@mui/material';
import { RxCross2 } from 'react-icons/rx';
import { TableHeader } from '@/components/ui/table';
import { FiX, FiCheck } from "react-icons/fi";
import { useGetAllAdminInvestmentsQuery } from '@/store/services/api';

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto',
  borderRadius: 2,
};


interface Props {
  open: boolean;
  onClose: () => void;
  InventoryId: any;
}


interface Lead {
  name: string;
  email: string;
  investmentAmount: string;
  profitAmt: string;
  profits: string;
}

const leadsData: Lead[] = [
  { name: 'John', email: 'johndoe@example.com', investmentAmount: '$ 500.00', profitAmt: 'accepted', profits: '10.00%' },
  { name: 'John', email: 'johndoe@example.com', investmentAmount: '$ 500.00', profitAmt: 'accepted', profits: '10.00%' },
  { name: 'John', email: 'johndoe@example.com', investmentAmount: '$ 500.00', profitAmt: 'accepted', profits: '10.00%' },


];

const TotalInvestorsModal: React.FC<Props> = ({ open, onClose, InventoryId }) => {
  const { data: InvestmentData, isLoading, isError } = useGetAllAdminInvestmentsQuery(InventoryId);
  const approvedInvestments = InvestmentData?.investment?.filter((lead: any) => lead.status === 'approved');
  console.log(approvedInvestments, 'approved investment ')
  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <Box>
    <div className='w-full flex p-[15px] justify-between items-center mb-6 border-b border-[#DDD] pb-3'>
          <p className='text-[18px] font-family text-black font-semibold'>Total Investors</p>
          <RxCross2 onClick={onClose} className='cursor-pointer text-[#818181] text-3xl' />
        </div>
       
        <div className="max-w-full mx-[15px] my-6 overflow-x-auto border border-[#DDD] rounded-lg">
        <Table>
              <TableHeader className="bg-[#F5F5F5]">
                <TableRow>
                  {['NAME', 'EMAIL', 'INV. AMT', 'PROFIT AMT', 'PROFITS%'].map((heading) => (
                    // <TableCell key={heading} className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    //   {heading}
                    // </TableCell>

                     <TableCell key={heading} className="  !text-start">
                                        <div className=' w-full flex gap-5 justify-between font-medium text-[#616161] font-family items-center '>
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
                {approvedInvestments?.map((lead: any, index: any) => (
                  <TableRow key={index}>
                    <TableCell className="px-5 py-4 !text-[13px] !text-[#616161]">{lead.user.first_name} {lead?.user?.last_name}</TableCell>
                    <TableCell className="px-5 py-4 !text-[13px] !text-[#616161]">{lead.user.email}</TableCell>
                    <TableCell className="px-5 py-4 !text-[13px] !text-[#616161]">$ {lead.investment_amount}</TableCell>
                    <TableCell className="px-5 py-4 !text-[13px] !text-[#616161]">{lead.profitAmt || '--'}</TableCell>
                    <TableCell className="px-5 py-4 !text-[13px] !text-[#616161]">{lead.profits || '--'}</TableCell>
                  </TableRow>
                ))}
                
              </TableBody>
            </Table>
        </div>
       

        </Box>
      </Dialog>
    </>
  )
}

export default TotalInvestorsModal;