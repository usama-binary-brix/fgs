import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,

} from '@mui/material';
import { useParams } from 'next/navigation';
import { useGetAllTimelineQuery } from '@/store/services/api';
import Input from '@/components/form/input/InputField';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import Button from '@/components/ui/button/Button';
import { RxCross2 } from 'react-icons/rx';


const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingY: '10px',
    overflowY: 'auto',
    borderRadius: 2,
};


interface StageInput {
    stage_id: number;
    price: number;
}

interface CostSummaryProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (stages: StageInput[]) => void;
}

const AddInventoryCostSummary: React.FC<CostSummaryProps> = ({
    open,
    onClose,
    onSubmit
}) => {
    const { id } = useParams();
    const { data: timelineData, error, isLoading } = useGetAllTimelineQuery(id);
    const [stagePrices, setStagePrices] = useState<any>({});

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;

    const handlePriceChange = (stageId: number, value: string) => {
        const numValue = parseFloat(value) || 0;
        setStagePrices((prev: any) => ({
            ...prev,
            [stageId]: numValue
        }));
    };

    const handleSubmit = () => {
        const formattedData = timelineData?.timeLine?.map((stage: any) => ({
            stage_id: stage.id,
            price: stagePrices[stage.id] || 0
        })) || [];

        onSubmit(formattedData);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <div className=' border-b border-gray-400 mb-3 py-3'>

                    <div className='flex justify-between items-center px-4'>
                        <p className='text-xl font-semibold'>Inventory Cost Summary</p>

                        <RxCross2 onClick={onClose} className='cursor-pointer text-3xl' />

                    </div>
                </div>
                <div className='px-4'>
                    <p className='text-md text-[#616161] mb-1 font-medium'>Inventory Cost Summary</p>


                </div>
                <div className='px-5'>

                    <Table className='border rounded-full'>
                        <TableHeader className="sticky top-0 z-50 border-b bg-[#F7F7F7] border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                {['Stage Name', 'Total Stage cost'].map((heading) => (
                                    <TableCell key={heading} className="px-5 py-3 uppercase text-[#616161] font-medium text-start text-[14px] dark:text-gray-400">
                                        <div className=' w-full flex justify-between items-center '>
                                            {heading}

                                        </div>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody >
                            {timelineData?.timeLine?.map((stage: any) => (
                                <TableRow key={stage.id}>

                                    <TableCell className=' px-4 text-sm text-[#616161]'>{stage.name}</TableCell>
                                    <TableCell className='px-3 py-2'>
                                        <Input
                                            placeholder='$ 0.00'
                                            value={stagePrices[stage.id] || ''}
                                            onChange={(e) => handlePriceChange(stage.id, e.target.value)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>

                    <div className='flex items-center gap-3 justify-end mt-4'>

                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            disabled={!timelineData?.timeLine?.length}
                        >
                            Add Cost
                        </Button>
                    </div>

                </div>
            </Box>
        </Modal>
    );
};

export default AddInventoryCostSummary;