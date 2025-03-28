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
        <div className='w-full flex p-[15px] justify-between items-center mb-6 border-b border-[#DDD] pb-3'>
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
        <div className="max-w-full mx-[15px] my-6 overflow-x-auto border border-[#DDD] rounded-lg">
          <Table className='border-separate border-spacing-0'>
            <TableHeader className="bg-[#F5F5F5] h-[40px] font-medium font-family text-[12px]">
              <TableRow className='border-b-0'>
                {['NAME', 'EMAIL', 'INVESTMENT AMOUNT', 'STATUS/ACTION'].map((heading) => (
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
            <TableBody className="divide-y divide-gray-100">
              {filteredInvestments?.map((lead: any, index: number) => (
                <TableRow className=" !border-t-0 !border-b-0" key={index}>
                <TableCell className=" !text-[13px] !text-[#616161] !font-medium !font-family !border-b-0">{lead.user.first_name} {lead.user.last_name}</TableCell>
                <TableCell className=" !text-[13px] !text-[#616161] !font-medium !font-family !border-b-0">{lead.user.email}</TableCell>
                <TableCell className=" !text-[13px] !text-[#616161] !font-medium !font-family !border-b-0">$ {lead.investment_amount}</TableCell>
              
                <TableCell className="px-5 py-4 text-[13px] !border-b-0">
                  {lead.status === 'pending' ? (
                    <div className="flex items-center gap-3">
                      {/* Reject Button */}
                      <span
                        className="border border-[#D1842880] bg-[#D184281A] cursor-pointer rounded p-1"
                        onClick={() => handleStatusUpdate(lead.id, 'rejected')}
                      >
                        <FiX size={19} color="#D18428" />
                      </span>
                      {/* Approve Button */}
                      <span
                        className="border border-[#D1842880] rounded p-1 cursor-pointer bg-[#D18428]"
                        onClick={() => handleStatusUpdate(lead.id, 'approved')}
                      >
                        <FiCheck size={19} color="#fff" />
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
