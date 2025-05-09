
import React, { useEffect, useState } from 'react';
import {
    Modal,
    Box,
} from '@mui/material';
import { useParams } from 'next/navigation';
import { useAddAdditionalCostMutation, useAddInventoryCostMutation, useAddSellingPriceMutation, useCalculateProfitMutation, useDeleteAdditionalCostRowMutation, useGetAllTimelineQuery, useGetInventorySellingPriceQuery } from '@/store/services/api';
import Input from '@/components/form/input/InputField';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import Button from '@/components/ui/button/Button';
import { RxCross2 } from 'react-icons/rx';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { ErrorResponse } from '../../../accounts/components/AccountsModal';
import Label from '@/components/form/Label';
import { FaTrash } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';

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

// interface AdditionalCost {
//     id: number;
//     name: string;
//     cost: number;
// }

interface AdditionalCost {
    id?: number;  // Make optional for new items
    inventory_id: number;
    cost_name: string;
    cost: string | number;
    added_by?: number;
    created_at?: string;
    updated_at?: string;
}

// interface TimelineResponse {
//     message: string;
//     timeLine: Stage[];
//     additional_cost: AdditionalCost[];
//     is_completed: boolean;
// }

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
    const [saveAdditionalCost] = useAddAdditionalCostMutation();

    const {
        data: timelineData,
        error,
        isLoading,
        refetch,
    } = useGetAllTimelineQuery(id, {
        skip: !open,
    });
    const {
        data: sellingPrice,
        error: sellingPriceError,
        isLoading: sellingPriceLoading,
        refetch: sellingPriceRefetch,
    } = useGetInventorySellingPriceQuery(id, {
        skip: !open,
    });
    const [additionalCost, setAdditionalCost] = useState(false);

    const [deleteAdditionalRow, { isLoading: isDeleting }] = useDeleteAdditionalCostRowMutation();

    const handleDeleteAdditionalCostRow = async (index: any, id: any) => {
        try {
            await deleteAdditionalRow(id).unwrap();
        } catch (error) {
            //   toast.error('Failed to delete user!');
        }
        const newCosts = [...additionalCosts];
        newCosts.splice(index, 1);
        setAdditionalCosts(newCosts);
        if (newCosts.length === 0) {
            setAdditionalCost(false);
        }


    };
    const [additionalCosts, setAdditionalCosts] = useState<AdditionalCost[]>([]);

    // Initialize with API data when modal opens
    useEffect(() => {
        if (open && timelineData?.additional_cost) {
            setAdditionalCosts(timelineData.additional_cost.map((cost: any) => ({
                ...cost,
                cost: parseFloat(cost.cost) || 0
            })));
        }
    }, [open, timelineData?.additional_cost]);


    const handleAddAdditionalCost = () => {
        setAdditionalCosts([...additionalCosts, {
            inventory_id: Number(id),
            cost_name: '',
            cost: 0
        }]);
    };

    const handleDeleteAdditionalCost = (index: number, id: any) => {
        const newCosts = [...additionalCosts];
        newCosts.splice(index, 1);
        setAdditionalCosts(newCosts);
    };

    const handleAdditionalCostChange = (index: number, field: keyof AdditionalCost, value: string | number) => {
        const newCosts = [...additionalCosts];
        newCosts[index] = {
            ...newCosts[index],
            [field]: field === 'cost' ? (typeof value === 'string' ? parseFloat(value) || 0 : value) : value
        };
        setAdditionalCosts(newCosts);
    };


    const showAdditionalCost = () => {
        setAdditionalCost(true);
        if (additionalCosts.length === 0) {
            handleAddAdditionalCost();
        }
    };


    useEffect(() => {
        if (open) {
            refetch();
            sellingPriceRefetch();
        }
    }, [open, refetch, sellingPriceRefetch]);

    const [inventoryCost] = useAddInventoryCostMutation();
    const [calculateProfit] = useCalculateProfitMutation();
    const [addSellingPrice] = useAddSellingPriceMutation();

    const formik = useFormik({
        initialValues: {
            stages: timelineData?.timeLine?.map((stage: any) => ({
                stage_id: stage.id,
                price: stage.price || ''
            })) || [],
            sellingPrice: sellingPrice?.data?.selling_price || '',
            profit: sellingPrice?.data?.profit || ''
        },
        enableReinitialize: true,
        onSubmit: async (values, { resetForm }) => {
            try {
                const payload = {
                    stages: values.stages
                };

                const response = await inventoryCost(payload).unwrap();
                toast.success(response.message || 'Success');
                if (sellingPrice?.data?.selling_price) {
                    await debouncedCalculateProfit(parseFloat(values.sellingPrice));
                }

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
            formik.setFieldValue('profit', '');
            formik.setFieldValue('sellingPrice', '');
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
        const numValue = parseFloat(value);

        const finalValue = isNaN(numValue) || numValue < 0 ? 0 : numValue;
        formik.setFieldValue(`stages[${index}].price`, finalValue);
    };

    const hasPositiveStagePrice = timelineData?.timeLine?.every((stage: any) =>
        stage.price && parseFloat(stage.price as unknown as string) > 0
    );



    // const handleSaveAdditionalCosts = async () => {
    //     await formik.submitForm()

    //     try {
    //         const savePromises = additionalCosts.map(cost => {
    //             const payload = {
    //                 inventory_id: Number(id),
    //                 cost_name: cost.cost_name,
    //                 cost: Number(cost.cost)
    //             };

             
    //             if (cost.id) {
    //                 return saveAdditionalCost({
    //                     ...payload,
    //                     additional_cost_id: cost.id
    //                 }).unwrap();
    //             }
              
    //             return saveAdditionalCost(payload).unwrap();
    //         });

    //         await Promise.all(savePromises);
    //         toast.success('Additional costs saved successfully');
    //         refetch(); // Clear the additional costs after saving
    //     } catch (error) {
    //         const errorResponse = error as ErrorResponse;
    //         if (errorResponse?.data?.error) {
    //             Object.values(errorResponse.data.error).forEach((errorMessage) => {
    //                 if (Array.isArray(errorMessage)) {
    //                     errorMessage.forEach((msg) => toast.error(msg));
    //                 } else {
    //                     toast.error(errorMessage);
    //                 }
    //             });
    //         } else {
    //             toast.error('Failed to save additional costs');
    //         }
    //     }
    // };

    const handleSaveAdditionalCosts = async () => {
    await formik.submitForm();

    try {
        const additional_costs = additionalCosts.map(cost => ({
            inventory_id: Number(id),
            cost_name: cost.cost_name,
            cost: Number(cost.cost),
            ...(cost.id && { additional_cost_id: cost.id })
        }));

        // Send the array in a single API call
        await saveAdditionalCost({ additional_costs }).unwrap();

        toast.success('Additional costs saved successfully');
        refetch(); // Clear or refresh the data after saving
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
            toast.error('Failed to save additional costs');
        }
    }
};

    const handleCloseReset = () => {
        onClose()
        setAdditionalCost(false)
    }
    return (
        <Modal open={open} onClose={handleCloseReset}>
            <Box sx={modalStyle}>
                <div className=' border-b border-gray-400 mb-3 py-3'>
                    <div className='flex justify-between items-center px-4'>
                        <p className='text-xl font-semibold'>Inventory Cost Summary</p>
                        <RxCross2 onClick={handleCloseReset} className='cursor-pointer text-3xl' />
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
                                        <TableCell className=' px-4 text-sm text-[#616161] w-110'>{stage.name}</TableCell>
                                        <TableCell className='px-3 py-2'>
                                            <Input
                                                name={`stages[${index}].price`}
                                                placeholder='$ 0.00'
                                                value={formik.values.stages[index]?.price || ''}
                                                onChange={(e) => handlePriceChange(index, e.target.value)}
                                                type="number"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {(
                            (!additionalCost || additionalCosts?.length === 0) &&
                            timelineData?.additional_cost?.length === 0
                        ) && (
                                <>
                                    <div className='flex items-center gap-3 justify-end mt-4'>
                                        <Button
                                            onClick={showAdditionalCost}
                                            variant="fgsoutline"
                                        >
                                            Add Additional Cost
                                        </Button>
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            disabled={!timelineData?.timeLine?.length || formik.isSubmitting}
                                        >
                                            {formik.isSubmitting ? 'Submitting...' : "Save Inventory Cost"}
                                        </Button>
                                    </div>
                                </>
                            )}


                    </div>
                </form>

                {additionalCosts?.length > 0 && (
                    <>
                        <div className='mt-6 px-4'>
                            <div className='mb-2 flex justify-between items-center'>
                                <p className='text-md text-[#414141] font-medium'>Additional Costs</p>
                                <button
                                    onClick={handleAddAdditionalCost}
                                    className='text-primary border-2 rounded-md text-sm p-1 border-primary flex items-center gap-1 cursor-pointer'
                                >
                                    <IoMdAdd /> Add Row
                                </button>
                            </div>

                            <Table className='border rounded-full'>
                                <TableHeader className="sticky top-0 z-50 border-b bg-[#F7F7F7] border-gray-100">
                                    <TableRow>
                                        {['Name', 'Total Cost', 'Action'].map((heading) => (
                                            <TableCell
                                                key={heading}
                                                className={`px-5 py-3 uppercase text-[#616161] font-medium text-[14px] ${heading === 'Action' ? 'text-center' : 'text-start'
                                                    }`}
                                            >
                                                {heading}
                                            </TableCell>
                                        ))}
                                    </TableRow>

                                </TableHeader>

                                <TableBody>

                                    {additionalCosts.map((cost, index) => (
                                        <TableRow key={cost.id || `new-${index}`}>
                                            <TableCell className='px-3 py-2'>
                                                <Input
                                                    placeholder='Name'
                                                    value={cost.cost_name}
                                                    onChange={(e) => handleAdditionalCostChange(index, 'cost_name', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell className='px-3 py-2'>
                                                <Input
                                                    placeholder='$ 0.00'
                                                    value={cost.cost}
                                                    onChange={(e) => handleAdditionalCostChange(index, 'cost', e.target.value)}
                                                    type="number"
                                                    min="0"
                                                />
                                            </TableCell>
                                            <TableCell className='px-3 py-2 '>
                                                <div className='flex justify-center text-start items-center'>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteAdditionalCostRow(index, cost.id)}

                                                    >
                                                        <FaTrash />
                                                    </button>

                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <div className='flex items-center gap-3 justify-end mt-4'>

                                <Button
                                    variant="primary"
                                    onClick={handleSaveAdditionalCosts}
                                    disabled={
                                        additionalCosts.length === 0 ||
                                        additionalCosts.some(cost => !cost.cost_name || Number(cost.cost) <= 0) ||
                                        formik.isSubmitting
                                    }
                                >
                                    {formik.isSubmitting ? 'Saving...' : 'Save Inventory Cost'}
                                </Button>
                            </div>
                        </div>

                    </>
                )}


                {hasPositiveStagePrice && (
                    <div className='mt-6'>
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
                            <Button onClick={handleCloseReset} variant="fgsoutline">
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleSellingPriceSubmit}
                                disabled={!formik.values.sellingPrice || parseFloat(formik.values.sellingPrice) <= 0}
                            >
                                Mark as Sold
                            </Button>
                        </div>
                    </div>
                )}
            </Box>
        </Modal>
    );
};

export default AddInventoryCostSummary;