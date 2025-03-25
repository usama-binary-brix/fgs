'use client'
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
    status: 'all' | 'accepted' | 'rejected';
  }
  
  const leadsData: Lead[] = [
    { name: 'John', email: 'johndoe@example.com', investmentAmount: '$ 500.00', status: 'accepted' },
    { name: 'Erixbill', email: 'erixxbill@example.com', investmentAmount: '$ 200.00', status: 'rejected' },
    { name: ' doe', email: 'doe@example.com', investmentAmount: '$ 800.00', status: 'all' },
    
  ];

const InvestorRequestModal:  React.FC<Props> = ({open, onClose}) => {
    const [activeTab, setActiveTab] = useState<'all' | 'accepted' | 'rejected'>('all');
    const filteredLeads = activeTab === 'all' ? leadsData : leadsData.filter(lead => lead.status === activeTab);

    
    
      
    
  return (
    <>
     <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
      
      <div className='flex  justify-between items-center mb-6 border-b border-gray-400 pb-3'>
      <p className='text-xl font-semibold'>Investment Requests for I-73921</p>
      
      <RxCross2 onClick={onClose} className='cursor-pointer text-3xl'/>
      </div>
      <div className="flex items-center gap-3 mb-3">
          {['all', 'accepted', 'rejected'].map((tab) => (
            <button
              key={tab}
              className={`border border-[#D184281A] py-1 px-4 font-semibold rounded transition-all duration-300
                ${activeTab === tab ? 'bg-[#D18428] text-white' : 'bg-[#D184281A] text-[#D18428]'}`}
              onClick={() => setActiveTab(tab as 'all' | 'accepted' | 'rejected')}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

              <div className="max-w-full overflow-x-auto border border-gray-400 rounded-lg">
          <Table>
            <TableHeader className="bg-[#F5F5F5]">
              <TableRow>
                {[ 'NAME', 'EMAIL', 'INVESTMENT AMOUNT', 'ACTION'].map((heading) => (
                  <TableCell key={heading}  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredLeads.map((lead, index) => (
                <TableRow key={index}>
                  <TableCell className="px-5 py-4 text-xs">{lead.name}</TableCell>
                  <TableCell className="px-5 py-4 text-xs">{lead.email}</TableCell>
                  <TableCell className="px-5 py-4 text-xs">{lead.investmentAmount}</TableCell>
                  <TableCell>
                        <div className='flex items-center gap-3'>
                           <span className='border border-[#D1842880] bg-[#D184281A] cursor-pointer rounded p-1 '>
                           <FiX size={19} color='#D18428' />
                           </span>
                          <span className='border border-[#D1842880] rounded p-1 cursor-pointer bg-[#D18428]'>
                          <FiCheck size={19} color='#fff' />
                          </span>
                        </div>
                  </TableCell>
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

export default InvestorRequestModal;