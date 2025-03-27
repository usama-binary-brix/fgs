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
import { useGetAllAdminInvestmentsQuery, useUpdateInvestorStatusMutation } from '@/store/services/api';
import { toast } from 'react-toastify';

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

const InvestorRequestModal: React.FC<Props> = ({ open, onClose, InventoryId }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'accepted' | 'rejected' | 'pending'>('all');
  
  const { data: InvestmentData, isLoading, isError } = useGetAllAdminInvestmentsQuery(InventoryId);
const [updateStatus] = useUpdateInvestorStatusMutation()
  const filteredInvestments = InvestmentData?.investment?.filter((lead: any) =>
    activeTab === 'all' ? true : lead.status === activeTab
  );

  const handleStatusUpdate = async (investmentId: string, status: 'approved' | 'rejected') => {
    try {
      await updateStatus({ investment_id: investmentId, status }).unwrap();
      toast.success(`Investment ${status} successfully!`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
    }
  };
  
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <div className='w-full flex p-[15px] justify-between items-center mb-6 border-b border-gray-400 pb-3'>
          <p className='text-[18px] font-family text-black font-semibold'>Investment Requests</p>
          <RxCross2 onClick={onClose} className='cursor-pointer text-[#818181] text-3xl' />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-3 p-[15px]">
          {['all', 'pending', 'accepted', 'rejected'].map((tab) => (
            <button
              key={tab}
              className={`border border-[#D184281A] text-[13px] font-family py-1 px-4 font-semibold rounded transition-all duration-300
                ${activeTab === tab ? 'bg-[#D18428] text-white' : 'bg-[#D184281A] text-[#D18428]'}`}
              onClick={() => setActiveTab(tab as 'all' | 'pending' | 'accepted' | 'rejected')}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="max-w-full mx-[15px] my-6 overflow-x-auto border border-gray-400 rounded-lg">
          <Table>
            <TableHeader className="bg-[#F5F5F5] font-medium font-family text-[12px]">
              <TableRow>
                {['NAME', 'EMAIL', 'INVESTMENT AMOUNT', 'STATUS/ACTION'].map((heading) => (
                  <TableCell key={heading} className="px-5 py-3 font-medium text-gray-500 text-start">
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100">
              {filteredInvestments?.map((lead: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="px-5 py-4 text-[13px]">{lead.user.first_name} {lead.user.last_name}</TableCell>
                  <TableCell className="px-5 py-4 text-[13px]">{lead.user.email}</TableCell>
                  <TableCell className="px-5 py-4 text-[13px]">$ {lead.investment_amount}</TableCell>
                  
                  {/* Action Buttons Only if Status is Pending */}
                 {/* Action Buttons Only if Status is Pending */}
<TableCell className="px-5 py-4 text-[13px]">
  {lead.status === 'pending' ? (
    <div className='flex items-center gap-3'>
      {/* Reject Button */}
      <span 
        className='border border-[#D1842880] bg-[#D184281A] cursor-pointer rounded p-1'
        onClick={() => handleStatusUpdate(lead.id, 'rejected')}
      >
        <FiX size={19} color='#D18428' />
      </span>
      {/* Approve Button */}
      <span 
        className='border border-[#D1842880] rounded p-1 cursor-pointer bg-[#D18428]'
        onClick={() => handleStatusUpdate(lead.id, 'approved')}
      >
        <FiCheck size={19} color='#fff' />
      </span>
    </div>
  ) : (
    <span className={`px-3 py-1 rounded text-white ${lead.status === 'approved' ? 'bg-green-500' : 'bg-red-500'}`}>
      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
    </span>
  )}
</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Box>
    </Modal>
  );
}

export default InvestorRequestModal;
