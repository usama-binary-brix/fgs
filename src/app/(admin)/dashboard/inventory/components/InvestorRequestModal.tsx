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
    InventoryId:any
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

const InvestorRequestModal:  React.FC<Props> = ({open, onClose, InventoryId}) => {
    const [activeTab, setActiveTab] = useState<'all' | 'accepted' | 'rejected'>('all');
    const filteredLeads = activeTab === 'all' ? leadsData : leadsData.filter(lead => lead.status === activeTab);
    
    const { data: InvestmentData, isLoading, isError } = useGetAllAdminInvestmentsQuery(InventoryId);
    
    console.log(InvestmentData, 'investment data')
    
      
    
  return (
    <>
     <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
      
      <div className=' w-full flex p-[15px] justify-between items-center mb-6 border-b border-gray-400 pb-3'>
      <p className='text-[18px] font-family text-black font-semibold'>Investment Requests for I-73921</p>
      
      <RxCross2 onClick={onClose} className='cursor-pointer text-[#818181] text-3xl'/>
      </div>
      <div className="flex items-center gap-3 p-[15px]">
          {['all', 'accepted', 'rejected'].map((tab) => (
            <button
              key={tab}
              className={`border border-[#D184281A] text-[13px] font-family py-1 px-4 font-semibold rounded transition-all duration-300
                ${activeTab === tab ? 'bg-[#D18428] text-white' : 'bg-[#D184281A] text-[#D18428]'}`}
              onClick={() => setActiveTab(tab as 'all' | 'accepted' | 'rejected')}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

              <div className="max-w-full mx-[15px] overflow-x-auto border border-gray-400 rounded-lg">
          <Table>
            <TableHeader className="bg-[#F5F5F5] font-medium font-family text-[12px]">
              <TableRow>
                {[ 'NAME', 'EMAIL', 'INVESTMENT AMOUNT', 'ACTION'].map((heading) => (
                  <TableCell key={heading}  className="px-5 py-3 font-medium whitespace-nowrap text-gray-500 text-start text-theme-sm dark:text-gray-400">
                 <div className='flex justify-between items-center'>
                 {heading}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
  <path d="M4.8513 6.85227C4.63162 7.07194 4.63162 7.4281 4.8513 7.64777C5.07097 7.86743 5.42707 7.86743 5.64675 7.64777L4.8513 6.85227ZM7.49902 5.00002H8.06152C8.06152 4.77251 7.9245 4.5674 7.71427 4.48034C7.50412 4.39327 7.26217 4.4414 7.1013 4.60227L7.49902 5.00002ZM6.93652 14C6.93652 14.3107 7.18837 14.5625 7.49902 14.5625C7.80967 14.5625 8.06152 14.3107 8.06152 14H6.93652ZM13.1468 12.1477C13.3664 11.9281 13.3664 11.572 13.1468 11.3523C12.9271 11.1326 12.5709 11.1326 12.3513 11.3523L13.1468 12.1477ZM10.499 14H9.93652C9.93652 14.2275 10.0736 14.4326 10.2838 14.5197C10.4939 14.6068 10.7359 14.5586 10.8968 14.3977L10.499 14ZM11.0615 5.00002C11.0615 4.68936 10.8097 4.43752 10.499 4.43752C10.1884 4.43752 9.93652 4.68936 9.93652 5.00002H11.0615ZM5.64675 7.64777L7.89675 5.39777L7.1013 4.60227L4.8513 6.85227L5.64675 7.64777ZM6.93652 5.00002L6.93652 14H8.06152V5.00002H6.93652ZM12.3513 11.3523L10.1013 13.6023L10.8968 14.3977L13.1468 12.1477L12.3513 11.3523ZM11.0615 14L11.0615 5.00002H9.93652L9.93652 14H11.0615Z" fill="#616161"/>
</svg>
                 </div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredLeads.map((lead, index) => (
                <TableRow key={index}>
                  <TableCell className="px-5 py-4 text-[13px] font-normal whitespace-nowrap font-family">{lead.name}</TableCell>
                  <TableCell className="px-5 py-4 text-[13px] font-normal whitespace-nowrap font-family">{lead.email}</TableCell>
                  <TableCell className="px-5 py-4 text-[13px] font-normal whitespace-nowrap font-family">{lead.investmentAmount}</TableCell>
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