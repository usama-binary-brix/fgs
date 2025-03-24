import React, { useState } from 'react'
import {
  Modal,
  Box,
  Table,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { RxCross2 } from 'react-icons/rx';
import { TableHeader } from '@/components/ui/table';
import { FiX, FiCheck } from "react-icons/fi";

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

const TotalInvestorsModal:  React.FC<Props> = ({open, onClose}) => {
  
  return (
    <>
     <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
      
      <div className='flex  justify-between items-center mb-6 border-b border-gray-400 pb-3'>
      <p className='text-xl font-semibold'>Total Investors</p>
      
      <RxCross2 onClick={onClose} className='cursor-pointer text-3xl'/>
      </div>
     
              <div className="max-w-full overflow-x-auto border border-gray-400 rounded-lg">
          <Table>
            <TableHeader className="bg-[#F5F5F5]">
              <TableRow>
                {[ 'NAME', 'EMAIL', 'INV. AMT', 'PROFIT AMT', 'PROFITS%'].map((heading) => (
                  <TableCell key={heading}  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {leadsData.map((lead, index) => (
                <TableRow key={index}>
                  <TableCell className="px-5 py-4 text-xs">{lead.name}</TableCell>
                  <TableCell className="px-5 py-4 text-xs">{lead.email}</TableCell>
                  <TableCell className="px-5 py-4 text-xs">{lead.investmentAmount}</TableCell>
                  <TableCell className="px-5 py-4 text-xs">{lead.profitAmt}</TableCell>
                  <TableCell className="px-5 py-4 text-xs">{lead.profits}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
             
            </Box>
          </Modal>
    </>
  )
}

export default TotalInvestorsModal;