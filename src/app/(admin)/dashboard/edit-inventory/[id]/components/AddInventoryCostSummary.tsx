import React, { useEffect } from 'react';
import {
    Modal,
    Box,
} from '@mui/material';
import { useParams } from 'next/navigation';
import { useAddInventoryCostMutation, useAddSellingPriceMutation, useCalculateProfitMutation, useGetAllTimelineQuery } from '@/store/services/api';
import Input from '@/components/form/input/InputField';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import Button from '@/components/ui/button/Button';
import { RxCross2 } from 'react-icons/rx';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { ErrorResponse } from '../../../accounts/components/AccountsModal';
import Label from '@/components/form/Label';

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
    onSubmit?: (stages: StageInput[]) => void;
}

const AddInventoryCostSummary: React.FC<CostSummaryProps> = ({
    open,
    onClose,
    onSubmit
}) => {
    const { id } = useParams();

    const {
        data: timelineData,
        error,
        isLoading,
        refetch,
    } = useGetAllTimelineQuery(id, {
        skip: !open,
    });

    useEffect(() => {
        if (open) {
            refetch();
        }
    }, [open, refetch]);

    const [inventoryCost] = useAddInventoryCostMutation();
    const [calculateProfit] = useCalculateProfitMutation();
    const [addSellingPrice] = useAddSellingPriceMutation()

    const formik = useFormik({
        initialValues: {
            stages: timelineData?.timeLine?.map((stage: any) => ({
                stage_id: stage.id,
                price: stage.price || ''
            })) || [],
            sellingPrice: '',
            profit: ''
        },
        enableReinitialize: true,
        onSubmit: async (values, { resetForm }) => {
            try {
                const payload = {
                    stages: values.stages
                };

                const response = await inventoryCost(payload).unwrap();
                toast.success(response.message || 'Success');
                resetForm();
            } catch (error) {
                const errorResponse = error as ErrorResponse;
                if (errorResponse?.data?.error) {
                    Object.values(errorResponse.data.error).forEach((errorMessage) => {
                        if (Array.isArray(errorMessage)) {
                            errorMessage.forEach((msg) => toast.error(msg));
                        } else {
                            toast.error(errorMessage);
                        }
                    });
                }
            }
        }
    });

    const debounce = (func: Function, delay: number) => {
        let timer: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };

    const debouncedCalculateProfit = React.useCallback(
        debounce(async (sellingPrice: number) => {
            try {
                if (sellingPrice > 0) {
                    const response = await calculateProfit({
                        selling_price: sellingPrice,
                        inventory_id: id
                    }).unwrap();
                    formik.setFieldValue('profit', response.profit);
                } else {
                    formik.setFieldValue('profit', '');
                }
            } catch (error) {
                toast.error('Failed to calculate profit');
                formik.setFieldValue('profit', '');
            }
        }, 500), // 500ms delay
        [calculateProfit, id]
    );

    const handleSellingPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sellingPrice = parseFloat(e.target.value);
        formik.setFieldValue('sellingPrice', sellingPrice);
        debouncedCalculateProfit(sellingPrice);
    };

    // Add this handler function inside your component, before the return statement
    const handleSellingPriceSubmit = async () => {
        try {
            const sellingPrice = parseFloat(formik.values.sellingPrice);
            if (!sellingPrice || sellingPrice <= 0) {
                toast.error('Please enter a valid selling price');
                return;
            }

            const response = await addSellingPrice({
                selling_price: sellingPrice,
                inventory_id: id
            }).unwrap();

            toast.success(response.message || 'Selling price added successfully');
            onClose();
            formik.setFieldValue('profit', ''); // Optional: reset profit field
            formik.setFieldValue('sellingPrice', ''); // Optional: reset selling price field
        } catch (error) {
            const errorResponse = error as ErrorResponse;
            if (errorResponse?.data?.error) {
                Object.values(errorResponse.data.error).forEach((errorMessage) => {
                    if (Array.isArray(errorMessage)) {
                        errorMessage.forEach((msg) => toast.error(msg));
                    } else {
                        toast.error(errorMessage);
                    }
                });
            } else {
                toast.error('Failed to add selling price');
            }
        }
    };


    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;

    const handlePriceChange = (index: number, value: string) => {
        const numValue = parseFloat(value) || 0;
        formik.setFieldValue(`stages[${index}].price`, numValue);
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
                    <p className='text-md text-[#414141] mb-1 font-medium'>Stage's Cost Breakdown</p>
                </div>
                <form onSubmit={formik.handleSubmit}>
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

                            <TableBody>
                                {timelineData?.timeLine?.map((stage: any, index: number) => (
                                    <TableRow key={stage.id}>
                                        <TableCell className=' px-4 text-sm text-[#616161]'>{stage.name}</TableCell>
                                        <TableCell className='px-3 py-2'>
                                            <Input
                                                name={`stages[${index}].price`}
                                                placeholder='$ 0.00'
                                                // value={formik.values.stages[index]?.price || ''}

                                                value={formik.values.stages[index]?.price || ''}


                                                onChange={(e) => handlePriceChange(index, e.target.value)}
                                                type="number"

                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className='flex items-center gap-3 justify-end mt-4'>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={!timelineData?.timeLine?.length || formik.isSubmitting}
                            >
                                {formik.isSubmitting ? 'Submitting...' : 'Add Cost'}
                            </Button>
                        </div>
                    </div>
                </form>

                <div className=''>
                    <div className='px-4 mb-2'>
                        <p className='text-md text-[#414141] font-medium'>Final Cost & Profit</p>
                    </div>

                    <div className='grid grid-cols-2 gap-4 px-4'>
                        <div>
                        <Label>Selling Price <span className="text-error-500">*</span></Label>


                            <Input
                                name="sellingPrice"
                                placeholder='$ 0.00'
                                value={formik.values.sellingPrice}
                                onChange={handleSellingPriceChange}
                                type="number"
                                min="0"
                            />
                        </div>
                        <div>
                                          <Label>Profit (Auto calculated)</Label>
                            
                            <Input
                                name="profit"
                                placeholder='$ 0.00'
                                value={formik.values.profit}

                                type="number"
                            />
                        </div>

                    </div>

                    <div className='flex items-center gap-3 justify-end mt-4 pr-4'>
                    <Button onClick={onClose} variant="fgsoutline"
                >
                  Cancel
                </Button>
                        <Button
                            variant="primary"
                            onClick={handleSellingPriceSubmit}  // Changed from type="submit" to onClick
                        // disabled={!formik.values.sellingPrice || isNaN(parseFloat(formik.values.sellingPrice)) || formik.isSubmitting}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
};

export default AddInventoryCostSummary;