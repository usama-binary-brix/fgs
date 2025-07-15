import React, { useEffect, useState } from 'react';
import {
    Modal,
    Box,
} from '@mui/material';
import { useParams } from 'next/navigation';
import { useAddAdditionalCostMutation, useAddInventoryCostMutation, useAddSellingPriceMutation, useCalculateProfitMutation, useDeleteAdditionalCostRowMutation, useGetAllTimelineQuery, useGetInventorySellingPriceQuery, } from '@/store/services/api';
import Input from '@/components/form/input/InputField';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import Button from '@/components/ui/button/Button';
import { RxCross2 } from 'react-icons/rx';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { ErrorResponse } from '../../../accounts/components/AccountsModal';
import Label from '@/components/form/Label';
import { FaEdit, FaSave, FaTrash } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';
import { CiLock } from "react-icons/ci";
import { SlTrash } from "react-icons/sl";
import { AiOutlineEdit } from "react-icons/ai";


export const modalStyles = {
    base: "absolute pb-5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl rounded-lg overflow-y-auto",
    sizes: {
        default: "w-[85%] sm:w-[80%] md:w-[80%] lg:w-[70%] max-h-[80vh] md:max-h-[90vh]",
        small: "w-[70%] sm:w-[60%] md:w-[70%] lg:w-[60%] max-h-[70vh]",
        large: "w-[78%] sm:w-[65%] md:w-[90%] lg:w-[85%] max-h-[90vh]"
    },
    header: "sticky top-0 z-10 bg-white border-b border-gray-400 py-3 px-4",
    content: "px-4 py-4 overflow-y-auto",
    title: "text-lg sm:text-xl font-semibold",
    closeButton: "cursor-pointer text-2xl sm:text-3xl text-gray-600 hover:text-gray-900"
} as const;



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

    isEditing?: boolean;
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
    const [isEditing, setIsEditing] = useState(false);


    const handleEditAdditionalCost = (index: number) => {
        setAdditionalCosts(prev => prev.map((cost, i) =>
            i === index ? { ...cost, isEditing: true } : cost
        ));
    };

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
            profit: sellingPrice?.data?.gross_profit || 0,
            profit_percentage: sellingPrice?.data?.gross_profit_percentage || 0,
            salescommission: sellingPrice?.data?.selling_price ? sellingPrice?.data?.sales_commission_percentage : 15,
            salescommissionAmount: sellingPrice?.data?.sales_commission_amount || 0,
            fgscommission:  sellingPrice?.data?.selling_price ? sellingPrice?.data?.fgs_commission_percentage : 50,
            fgscommissionAmount: sellingPrice?.data?.fgs_commission_amount || 0,
            investorcomission:  sellingPrice?.data?.selling_price ? sellingPrice?.data?.investor_profit_percentage : 50,
            investorcomissionAmount: sellingPrice?.data?.investor_profit_amount || 0,
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
                    await calculateProfit({
                        selling_price: parseFloat(values.sellingPrice),
                        inventory_id: id,
                        sales_commission_percentage: parseFloat(values.salescommission) || 0,
                        fgs_commission_percentage: parseFloat(values.fgscommission) || 0,
                        investor_profit_percentage: parseFloat(values.investorcomission) || 0
                    }).unwrap();
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

    const handleSellingPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9.]/g, '');
        formik.setFieldValue('sellingPrice', value);

        if (value) {
            const payload = {
                selling_price: parseFloat(value),
                inventory_id: id,
                sales_commission_percentage: parseFloat(formik.values.salescommission) || 15,
                fgs_commission_percentage: parseFloat(formik.values.fgscommission) || 50,
                investor_profit_percentage: parseFloat(formik.values.investorcomission) || 50
            };
            debouncedCalculateProfit(payload);
        } else {
            // Reset all commission fields if selling price is cleared
            formik.setFieldValue('profit', 0);
            formik.setFieldValue('profit_percentage', 0);
            formik.setFieldValue('salescommission', 0);
            formik.setFieldValue('salescommissionAmount', 0);
            formik.setFieldValue('fgscommission', 0);
            formik.setFieldValue('fgscommissionAmount', 0);
            formik.setFieldValue('investorcomission', 0);
            formik.setFieldValue('investorcomissionAmount', 0);
        }
    };

    const handleSalesCommissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9.]/g, '');
        formik.setFieldValue('salescommission', value);
        if (formik.values.sellingPrice) {
            calculateProfit({
                selling_price: parseFloat(formik.values.sellingPrice),
                inventory_id: id,
                sales_commission_percentage: parseFloat(value) || 0,
                fgs_commission_percentage: parseFloat(formik.values.fgscommission) || 0,
                investor_profit_percentage: parseFloat(formik.values.investorcomission) || 0
            }).unwrap().then(response => {
                formik.setFieldValue('profit', response.gross_profit || '');
                formik.setFieldValue('profit_percentage', response.gross_profit_percentage || '');
                formik.setFieldValue('salescommissionAmount', response.sales_commission_amount || '');
                formik.setFieldValue('fgscommissionAmount', response.fgs_commission_amount || '');
                formik.setFieldValue('investorcomissionAmount', response.investor_profit_amount || '');
              

            }).catch(error => {
                toast.error('Failed to calculate profit');
            });
        }
    };

    const debounce = (func: Function, delay: number) => {
        let timer: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };

    const debouncedCalculateProfit = debounce(async (payload: any) => {
        try {
            const response = await calculateProfit(payload).unwrap();
            formik.setFieldValue('profit', response.gross_profit || 0);
            formik.setFieldValue('profit_percentage', response.gross_profit_percentage || 0);
            formik.setFieldValue('salescommissionAmount', response.sales_commission_amount || 0);
            formik.setFieldValue('fgscommissionAmount', response.fgs_commission_amount || 0);
            formik.setFieldValue('investorcomissionAmount', response.investor_profit_amount || 0);
        } catch (error) {
            toast.error('Failed to calculate profit');
        }
    }, 500);

    const handleFgsCommissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9.]/g, '');
        const fgsValue = parseFloat(value) || 0;
        const investorValue = 100 - fgsValue;

        formik.setFieldValue('fgscommission', fgsValue);
        formik.setFieldValue('investorcomission', investorValue);

        if (formik.values.sellingPrice) {
            const payload = {
                selling_price: parseFloat(formik.values.sellingPrice),
                inventory_id: id,
                sales_commission_percentage: parseFloat(formik.values.salescommission) || 0,
                fgs_commission_percentage: fgsValue,
                investor_profit_percentage: investorValue
            };
            debouncedCalculateProfit(payload);
        }
    };

    const handleInvestorCommissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9.]/g, '');
        const investorValue = parseFloat(value) || 0;
        const fgsValue = 100 - investorValue;

        formik.setFieldValue('investorcomission', investorValue);
        formik.setFieldValue('fgscommission', fgsValue);

        if (formik.values.sellingPrice) {
            const payload = {
                selling_price: parseFloat(formik.values.sellingPrice),
                inventory_id: id,
                sales_commission_percentage: parseFloat(formik.values.salescommission) || 0,
                fgs_commission_percentage: fgsValue,
                investor_profit_percentage: investorValue
            };
            debouncedCalculateProfit(payload);
        }
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
                inventory_id: id,
                sales_commission_percentage: parseFloat(formik.values.salescommission) || 0,
                fgs_commission_percentage: parseFloat(formik.values.fgscommission) || 0,
                investor_profit_percentage: parseFloat(formik.values.investorcomission) || 0
            }).unwrap();

            toast.success(response.message || 'Selling price added successfully');
            onClose();
            sellingPriceRefetch(); // Refresh selling price data
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

    if (sellingPriceLoading) return <div>Loading...</div>;
    if (sellingPriceError) return <div>Error loading data</div>;

    const handlePriceChange = (index: number, value: string) => {
        const numValue = parseFloat(value);

        const finalValue = isNaN(numValue) || numValue < 0 ? 0 : numValue;
        formik.setFieldValue(`stages[${index}].price`, finalValue);
    };

    const hasPositiveStagePrice = timelineData?.timeLine?.every((stage: any) =>
        stage.price && parseFloat(stage.price as unknown as string) > 0
    );


    const handleSaveAdditionalCosts = async () => {
        await formik.submitForm();

        try {
            const additional_costs = additionalCosts.map(cost => ({
                inventory_id: Number(id),
                cost_name: cost.cost_name,
                cost: Number(cost.cost),
                ...(cost.id && { additional_cost_id: cost.id })
            }));


            await saveAdditionalCost({ additional_costs }).unwrap();


            refetch();
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
            <Box className={`${modalStyles.base} ${modalStyles.sizes.default}`}>
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
                                        <TableCell key={heading} className=" px-2 py-1 lg:px-5 lg:py-3 uppercase text-[#616161] font-medium text-start text-[14px] dark:text-gray-400">
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
                                        <TableCell className=' px-4 text-sm text-[#616161] lg:w-110'>{stage.name}</TableCell>
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
                                                className={`px-2 py-2 lg:px-5 lg:py-3 uppercase text-[#616161] font-medium text-[14px] ${heading === 'Action' ? 'text-center' : 'text-start'
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
                                            {/* Cost Name Cell */}
                                            <TableCell className='px-4 text-sm text-[#616161] lg:w-110'>
                                                {cost.isEditing || !cost.id ? (
                                                    <Input
                                                        placeholder='Name'
                                                        value={cost.cost_name}
                                                        onChange={(e) => handleAdditionalCostChange(index, 'cost_name', e.target.value)}
                                                    />
                                                ) : (
                                                    cost.cost_name
                                                )}
                                            </TableCell>

                                            {/* Cost Value Cell */}
                                            <TableCell className='px-3 py-2'>
                                                {!cost.id ? (
                                                    <Input
                                                        placeholder='$ 0.00'
                                                        value={cost.cost}
                                                        onChange={(e) => handleAdditionalCostChange(index, 'cost', e.target.value)}
                                                        min="0"
                                                    />
                                                ) : (
                                                    <Input
                                                        placeholder='$ 0.00'
                                                        value={cost.cost}
                                                        onChange={(e) => handleAdditionalCostChange(index, 'cost', e.target.value)}
                                                        min="0"
                                                    />
                                                )}
                                            </TableCell>

                                            {/* Actions Cell */}
                                            <TableCell className='px-3 py-2'>
                                                <div className='flex justify-center text-start items-center gap-2'>
                                                    {/* Delete button - always shown */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteAdditionalCostRow(index, cost.id)}
                                                    >
                                                        <SlTrash className='text-[#818181] text-lg' />
                                                    </button>

                                                    {/* Edit/Save button - only shown for existing costs */}
                                                    {cost.id && (

                                                        <button
                                                            type="button"
                                                            onClick={() => handleEditAdditionalCost(index)}
                                                        >
                                                            <AiOutlineEdit className='text-[#818181] text-xl' />
                                                        </button>

                                                    )}
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

                                        additionalCosts.some(cost => !cost.cost_name || Number(cost.cost) < 0) ||
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
                    <>
                        <div className='mt-6'>
                            <div className='px-4 mb-2'>
                                <p className='text-md text-[#414141] font-medium'>Cost & Profit</p>
                            </div>

                            <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 px-4'>
                                <div>
                                    <Label className='flex items-center gap-1'>Purchase Price <CiLock className='text-lg' /></Label>
                                    <Input
                                        name="price_paid"
                                        placeholder='$ 0.00'
                                        value={timelineData?.timeLine[0]?.inventory?.price_paid}
                                        type="number"
                                        min="0"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <Label className='text-black'>Selling Price <span className="text-error-500">*</span></Label>
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
                                    <Label className='flex items-center gap-1'> Gross Profit (Auto calculated) <CiLock className='text-lg' /></Label>
                                    <Input
                                        name="profit"
                                        placeholder='$ 0.00'
                                        value={formik.values.profit}
                                        type="number"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <Label className='flex items-center gap-1'>Gross Profit % (Auto calculated) <CiLock className='text-lg' /></Label>
                                    <Input
                                        name="profit_percentage"
                                        placeholder='$ 0.00'
                                        value={`${formik.values.profit_percentage}%`}
                                        disabled
                                    />
                                </div>

                            </div>


                        </div>

                        <div className='mt-6'>


                            {formik.values.sellingPrice && (
                                <>
                                    <div className='px-4 mb-2'>
                                        <p className='text-md text-[#414141] font-medium'>Commissions Calculation</p>
                                    </div>
                                    <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 px-4'>
                                        <div>
                                            <Label className='text-black'>Sales Commission %</Label>
                                            <Input
                                                name="salescommission"
                                                placeholder='0%'
                                                value={formik.values.salescommission || 0}
                                                onChange={handleSalesCommissionChange}
                                            />
                                        </div>
                                        <div>
                                            <Label className='flex items-center gap-1'>Sales Commission Amount <CiLock className='text-lg' /></Label>
                                            <Input
                                                name="salescommissionAmount"
                                                placeholder='$ 0.00'
                                                value={formik.values.salescommissionAmount || 0}
                                                type="number"
                                                disabled
                                            />
                                        </div>
                                        <div>
                                            <Label className='text-black'>FGS Commission %</Label>
                                            <Input
                                                name="fgscommission"
                                                placeholder='0%'
                                                value={formik.values.fgscommission || 0}
                                                onChange={handleFgsCommissionChange}
                                            />
                                        </div>
                                        <div>
                                            <Label className='flex items-center gap-1'>FGS Commission Amount <CiLock className='text-lg' /></Label>
                                            <Input
                                                name="fgscommissionAmount"
                                                placeholder='$ 0.00'
                                                value={formik.values.fgscommissionAmount || 0}
                                                type="number"
                                                disabled
                                            />
                                        </div>
                                        <div>
                                            <Label className='text-black'>Investor Profit %</Label>
                                            <Input
                                                name="investorcomission"
                                                placeholder='0%'
                                                value={formik.values.investorcomission || 0}
                                                onChange={handleInvestorCommissionChange}
                                            />
                                        </div>
                                        <div>
                                            <Label className='flex items-center gap-1'>Investor Profit Amount <CiLock className='text-lg' /></Label>
                                            <Input
                                                name="investorcomissionAmount"
                                                placeholder='$ 0.00'
                                                value={formik.values.investorcomissionAmount || 0}
                                                type="number"
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </>

                            )}
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
                    </>
                )}








            </Box>
        </Modal>
    );
};

export default AddInventoryCostSummary;

// import React, { useEffect, useState } from 'react';
// import {
//     Modal,
//     Box,
// } from '@mui/material';
// import { useParams } from 'next/navigation';
// import { useAddAdditionalCostMutation, useAddInventoryCostMutation, useAddSellingPriceMutation, useCalculateProfitMutation, useDeleteAdditionalCostRowMutation, useGetAllTimelineQuery, useGetInventorySellingPriceQuery } from '@/store/services/api';
// import Input from '@/components/form/input/InputField';
// import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
// import Button from '@/components/ui/button/Button';
// import { RxCross2 } from 'react-icons/rx';
// import { useFormik } from 'formik';
// import { toast } from 'react-toastify';
// import { ErrorResponse } from '../../../accounts/components/AccountsModal';
// import Label from '@/components/form/Label';
// import { FaEdit, FaSave, FaTrash } from 'react-icons/fa';
// import { IoMdAdd } from 'react-icons/io';
// import { CiLock } from "react-icons/ci";
// import { SlTrash } from "react-icons/sl";
// import { AiOutlineEdit } from "react-icons/ai";


// export const modalStyles = {
//     base: "absolute pb-5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl rounded-lg overflow-y-auto",
//     sizes: {
//         default: "w-[85%] sm:w-[80%] md:w-[80%] lg:w-[70%] max-h-[80vh] md:max-h-[90vh]",
//         small: "w-[70%] sm:w-[60%] md:w-[70%] lg:w-[60%] max-h-[70vh]",
//         large: "w-[78%] sm:w-[65%] md:w-[90%] lg:w-[85%] max-h-[90vh]"
//     },
//     header: "sticky top-0 z-10 bg-white border-b border-gray-400 py-3 px-4",
//     content: "px-4 py-4 overflow-y-auto",
//     title: "text-lg sm:text-xl font-semibold",
//     closeButton: "cursor-pointer text-2xl sm:text-3xl text-gray-600 hover:text-gray-900"
// } as const;



// const modalStyle = {
//     position: 'absolute' as const,
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: '60%',
//     maxHeight: '90vh',
//     bgcolor: 'background.paper',
//     boxShadow: 24,
//     paddingY: '10px',
//     overflowY: 'auto',
//     borderRadius: 2,
// };

// interface StageInput {
//     stage_id: number;
//     price: number;
// }

// // interface AdditionalCost {
// //     id: number;
// //     name: string;
// //     cost: number;
// // }

// interface AdditionalCost {
//     id?: number;  // Make optional for new items
//     inventory_id: number;
//     cost_name: string;
//     cost: string | number;
//     added_by?: number;
//     created_at?: string;
//     updated_at?: string;

//     isEditing?: boolean;
// }

// // interface TimelineResponse {
// //     message: string;
// //     timeLine: Stage[];
// //     additional_cost: AdditionalCost[];
// //     is_completed: boolean;
// // }

// interface CostSummaryProps {
//     open: boolean;
//     onClose: () => void;
//     onSubmit?: (stages: StageInput[]) => void;
// }

// const AddInventoryCostSummary: React.FC<CostSummaryProps> = ({
//     open,
//     onClose,
//     onSubmit
// }) => {
//     const { id } = useParams();
//     const [saveAdditionalCost] = useAddAdditionalCostMutation();

//     const {
//         data: timelineData,
//         error,
//         isLoading,
//         refetch,
//     } = useGetAllTimelineQuery(id, {
//         skip: !open,
//     });
//     const {
//         data: sellingPrice,
//         error: sellingPriceError,
//         isLoading: sellingPriceLoading,
//         refetch: sellingPriceRefetch,
//     } = useGetInventorySellingPriceQuery(id, {
//         skip: !open,
//     });
//     const [additionalCost, setAdditionalCost] = useState(false);

//     const [deleteAdditionalRow, { isLoading: isDeleting }] = useDeleteAdditionalCostRowMutation();

//     const handleDeleteAdditionalCostRow = async (index: any, id: any) => {
//         try {
//             await deleteAdditionalRow(id).unwrap();
//         } catch (error) {
//             //   toast.error('Failed to delete user!');
//         }
//         const newCosts = [...additionalCosts];
//         newCosts.splice(index, 1);
//         setAdditionalCosts(newCosts);
//         if (newCosts.length === 0) {
//             setAdditionalCost(false);
//         }


//     };
//     const [additionalCosts, setAdditionalCosts] = useState<AdditionalCost[]>([]);
//     const [isEditing, setIsEditing] = useState(false);


//     const handleEditAdditionalCost = (index: number) => {
//         setAdditionalCosts(prev => prev.map((cost, i) =>
//             i === index ? { ...cost, isEditing: true } : cost
//         ));
//     };

//     // Initialize with API data when modal opens
//     useEffect(() => {
//         if (open && timelineData?.additional_cost) {
//             setAdditionalCosts(timelineData.additional_cost.map((cost: any) => ({
//                 ...cost,
//                 cost: parseFloat(cost.cost) || 0
//             })));
//         }
//     }, [open, timelineData?.additional_cost]);


//     const handleAddAdditionalCost = () => {
//         setAdditionalCosts([...additionalCosts, {
//             inventory_id: Number(id),
//             cost_name: '',
//             cost: 0
//         }]);
//     };

//     const handleDeleteAdditionalCost = (index: number, id: any) => {
//         const newCosts = [...additionalCosts];
//         newCosts.splice(index, 1);
//         setAdditionalCosts(newCosts);
//     };

//     const handleAdditionalCostChange = (index: number, field: keyof AdditionalCost, value: string | number) => {
//         const newCosts = [...additionalCosts];
//         newCosts[index] = {
//             ...newCosts[index],
//             [field]: field === 'cost' ? (typeof value === 'string' ? parseFloat(value) || 0 : value) : value
//         };
//         setAdditionalCosts(newCosts);
//     };


//     const showAdditionalCost = () => {
//         setAdditionalCost(true);
//         if (additionalCosts.length === 0) {
//             handleAddAdditionalCost();
//         }
//     };


//     useEffect(() => {
//         if (open) {
//             refetch();
//             sellingPriceRefetch();
//         }
//     }, [open, refetch, sellingPriceRefetch]);

//     const [inventoryCost] = useAddInventoryCostMutation();
//     const [calculateProfit] = useCalculateProfitMutation();
//     const [addSellingPrice] = useAddSellingPriceMutation();

//     const formik = useFormik({
//         initialValues: {
//             stages: timelineData?.timeLine?.map((stage: any) => ({
//                 stage_id: stage.id,
//                 price: stage.price || ''
//             })) || [],
//             sellingPrice: sellingPrice?.data?.selling_price || '',
//             salescommission:sellingPrice?.data?.salescommission || " ",
//             profit: sellingPrice?.data?.profit || '',
//             profit_percentage: sellingPrice?.data?.profit_percentage || ''
//         },
//         enableReinitialize: true,
//         onSubmit: async (values, { resetForm }) => {
//             try {
//                 const payload = {
//                     stages: values.stages
//                 };

//                 const response = await inventoryCost(payload).unwrap();
//                 toast.success(response.message || 'Success');
//                 if (sellingPrice?.data?.selling_price) {
//                     await debouncedCalculateProfit(parseFloat(values.sellingPrice));
//                 }

//                 resetForm();
//             } catch (error) {
//                 const errorResponse = error as ErrorResponse;
//                 if (errorResponse?.data?.error) {
//                     Object.values(errorResponse.data.error).forEach((errorMessage) => {
//                         if (Array.isArray(errorMessage)) {
//                             errorMessage.forEach((msg) => toast.error(msg));
//                         } else {
//                             toast.error(errorMessage);
//                         }
//                     });
//                 }
//             }
//         }
//     });



//     const debounce = (func: Function, delay: number) => {
//         let timer: NodeJS.Timeout;
//         return (...args: any[]) => {
//             clearTimeout(timer);
//             timer = setTimeout(() => func(...args), delay);
//         };
//     };

//     const debouncedCalculateProfit = React.useCallback(
//         debounce(async (sellingPrice: number) => {
//             try {
//                 if (sellingPrice > 0) {
//                     const response = await calculateProfit({
//                         selling_price: sellingPrice,
//                         inventory_id: id
//                     }).unwrap();
//                     formik.setFieldValue('profit', response.profit);
//                     formik.setFieldValue('profit_percentage', response.profit_percentage);
//                 } else {
//                     formik.setFieldValue('profit', '');
//                     formik.setFieldValue('profit_percentage', '');

//                 }
//             } catch (error) {
//                 toast.error('Failed to calculate profit');
//                 formik.setFieldValue('profit', '');
//                 formik.setFieldValue('profit_percentage', '');

//             }
//         }, 500), // 500ms delay
//         [calculateProfit, id]
//     );

//     const handleSellingPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const sellingPrice = parseFloat(e.target.value);
//         formik.setFieldValue('sellingPrice', sellingPrice);
//         debouncedCalculateProfit(sellingPrice);
//     };

//     //    const handleSalesCommisionPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     //     const salescommission = (e.target.value);
//     //     formik.setFieldValue('salescommission', salescommission);
//     //     // debouncedCalculateProfit(salescommission);
//     // };

// const handleSalesCommisionPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     let value = e.target.value;
    
//     // // Remove any existing % sign to avoid duplication
//     // value = value.replace(/%/g, '');
    
//     // // Add % sign if there's a value
//     // if (value !== '') {
//     //     value += '%';
//     // }
    
//     formik.setFieldValue('salescommission', value);
//     // debouncedCalculateProfit(value);
// };
//     const handleSellingPriceSubmit = async () => {
//         try {
//             const sellingPrice = parseFloat(formik.values.sellingPrice);
//             if (!sellingPrice || sellingPrice <= 0) {
//                 toast.error('Please enter a valid selling price');
//                 return;
//             }

//             const response = await addSellingPrice({
//                 selling_price: sellingPrice,
//                 inventory_id: id
//             }).unwrap();

//             toast.success(response.message || 'Selling price added successfully');
//             onClose();
//             formik.setFieldValue('profit', '');
//             formik.setFieldValue('sellingPrice', '');
//         } catch (error) {
//             const errorResponse = error as ErrorResponse;
//             if (errorResponse?.data?.error) {
//                 Object.values(errorResponse.data.error).forEach((errorMessage) => {
//                     if (Array.isArray(errorMessage)) {
//                         errorMessage.forEach((msg) => toast.error(msg));
//                     } else {
//                         toast.error(errorMessage);
//                     }
//                 });
//             } else {
//                 toast.error('Failed to add selling price');
//             }
//         }
//     };

//     if (isLoading) return <div>Loading...</div>;
//     if (error) return <div>Error loading data</div>;

//     const handlePriceChange = (index: number, value: string) => {
//         const numValue = parseFloat(value);

//         const finalValue = isNaN(numValue) || numValue < 0 ? 0 : numValue;
//         formik.setFieldValue(`stages[${index}].price`, finalValue);
//     };

//     const hasPositiveStagePrice = timelineData?.timeLine?.every((stage: any) =>
//         stage.price && parseFloat(stage.price as unknown as string) > 0
//     );


//     const handleSaveAdditionalCosts = async () => {
//         await formik.submitForm();

//         try {
//             const additional_costs = additionalCosts.map(cost => ({
//                 inventory_id: Number(id),
//                 cost_name: cost.cost_name,
//                 cost: Number(cost.cost),
//                 ...(cost.id && { additional_cost_id: cost.id })
//             }));


//             await saveAdditionalCost({ additional_costs }).unwrap();


//             refetch();
//         } catch (error) {
//             const errorResponse = error as ErrorResponse;
//             if (errorResponse?.data?.error) {
//                 Object.values(errorResponse.data.error).forEach((errorMessage) => {
//                     if (Array.isArray(errorMessage)) {
//                         errorMessage.forEach((msg) => toast.error(msg));
//                     } else {
//                         toast.error(errorMessage);
//                     }
//                 });
//             } else {
//                 toast.error('Failed to save additional costs');
//             }
//         }
//     };

//     const handleCloseReset = () => {
//         onClose()
//         setAdditionalCost(false)
//     }
//     return (
//         <Modal open={open} onClose={handleCloseReset}>
//             <Box className={`${modalStyles.base} ${modalStyles.sizes.default}`}>
//                 <div className=' border-b border-gray-400 mb-3 py-3'>
//                     <div className='flex justify-between items-center px-4'>
//                         <p className='text-xl font-semibold'>Inventory Cost Summary</p>
//                         <RxCross2 onClick={handleCloseReset} className='cursor-pointer text-3xl' />
//                     </div>
//                 </div>
//                 <div className='px-4'>
//                     <p className='text-md text-[#414141] mb-1 font-medium'>Stage's Cost Breakdown</p>
//                 </div>
//                 <form onSubmit={formik.handleSubmit}>
//                     <div className='px-5'>
//                         <Table className='border rounded-full'>
//                             <TableHeader className="sticky top-0 z-50 border-b bg-[#F7F7F7] border-gray-100 dark:border-white/[0.05]">
//                                 <TableRow>
//                                     {['Stage Name', 'Total Stage cost'].map((heading) => (
//                                         <TableCell key={heading} className=" px-2 py-1 lg:px-5 lg:py-3 uppercase text-[#616161] font-medium text-start text-[14px] dark:text-gray-400">
//                                             <div className=' w-full flex justify-between items-center '>
//                                                 {heading}
//                                             </div>
//                                         </TableCell>
//                                     ))}
//                                 </TableRow>
//                             </TableHeader>

//                             <TableBody>
//                                 {timelineData?.timeLine?.map((stage: any, index: number) => (
//                                     <TableRow key={stage.id}>
//                                         <TableCell className=' px-4 text-sm text-[#616161] lg:w-110'>{stage.name}</TableCell>
//                                         <TableCell className='px-3 py-2'>
//                                             <Input
//                                                 name={`stages[${index}].price`}
//                                                 placeholder='$ 0.00'
//                                                 value={formik.values.stages[index]?.price || ''}
//                                                 onChange={(e) => handlePriceChange(index, e.target.value)}
//                                                 type="number"
//                                             />
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>

//                         {(
//                             (!additionalCost || additionalCosts?.length === 0) &&
//                             timelineData?.additional_cost?.length === 0
//                         ) && (
//                                 <>
//                                     <div className='flex items-center gap-3 justify-end mt-4'>
//                                         <Button
//                                             onClick={showAdditionalCost}
//                                             variant="fgsoutline"
//                                         >
//                                             Add Additional Cost
//                                         </Button>
//                                         <Button
//                                             variant="primary"
//                                             type="submit"
//                                             disabled={!timelineData?.timeLine?.length || formik.isSubmitting}
//                                         >
//                                             {formik.isSubmitting ? 'Submitting...' : "Save Inventory Cost"}
//                                         </Button>
//                                     </div>
//                                 </>
//                             )}


//                     </div>
//                 </form>

//                 {additionalCosts?.length > 0 && (
//                     <>
//                         <div className='mt-6 px-4'>
//                             <div className='mb-2 flex justify-between items-center'>
//                                 <p className='text-md text-[#414141] font-medium'>Additional Costs</p>
//                                 <button
//                                     onClick={handleAddAdditionalCost}
//                                     className='text-primary border-2 rounded-md text-sm p-1 border-primary flex items-center gap-1 cursor-pointer'
//                                 >
//                                     <IoMdAdd /> Add Row
//                                 </button>
//                             </div>

//                             <Table className='border rounded-full'>
//                                 <TableHeader className="sticky top-0 z-50 border-b bg-[#F7F7F7] border-gray-100">
//                                     <TableRow>
//                                         {['Name', 'Total Cost', 'Action'].map((heading) => (
//                                             <TableCell
//                                                 key={heading}
//                                                 className={`px-2 py-2 lg:px-5 lg:py-3 uppercase text-[#616161] font-medium text-[14px] ${heading === 'Action' ? 'text-center' : 'text-start'
//                                                     }`}
//                                             >
//                                                 {heading}
//                                             </TableCell>
//                                         ))}
//                                     </TableRow>

//                                 </TableHeader>

//                                 <TableBody>

//                                     {additionalCosts.map((cost, index) => (
//                                         <TableRow key={cost.id || `new-${index}`}>
//                                             {/* Cost Name Cell */}
//                                             <TableCell className='px-4 text-sm text-[#616161] lg:w-110'>
//                                                 {cost.isEditing || !cost.id ? (
//                                                     <Input
//                                                         placeholder='Name'
//                                                         value={cost.cost_name}
//                                                         onChange={(e) => handleAdditionalCostChange(index, 'cost_name', e.target.value)}
//                                                     />
//                                                 ) : (
//                                                     cost.cost_name
//                                                 )}
//                                             </TableCell>

//                                             {/* Cost Value Cell */}
//                                             <TableCell className='px-3 py-2'>
//                                                 {!cost.id ? (
//                                                     <Input
//                                                         placeholder='$ 0.00'
//                                                         value={cost.cost}
//                                                         onChange={(e) => handleAdditionalCostChange(index, 'cost', e.target.value)}
//                                                         min="0"
//                                                     />
//                                                 ) : (
//                                                     <Input
//                                                         placeholder='$ 0.00'
//                                                         value={cost.cost}
//                                                         onChange={(e) => handleAdditionalCostChange(index, 'cost', e.target.value)}
//                                                         min="0"
//                                                     />
//                                                 )}
//                                             </TableCell>

//                                             {/* Actions Cell */}
//                                             <TableCell className='px-3 py-2'>
//                                                 <div className='flex justify-center text-start items-center gap-2'>
//                                                     {/* Delete button - always shown */}
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => handleDeleteAdditionalCostRow(index, cost.id)}
//                                                     >
//                                                         <SlTrash className='text-[#818181] text-lg' />
//                                                     </button>

//                                                     {/* Edit/Save button - only shown for existing costs */}
//                                                     {cost.id && (

//                                                         <button
//                                                             type="button"
//                                                             onClick={() => handleEditAdditionalCost(index)}
//                                                         >
//                                                             <AiOutlineEdit className='text-[#818181] text-xl' />
//                                                         </button>

//                                                     )}
//                                                 </div>
//                                             </TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>

//                             <div className='flex items-center gap-3 justify-end mt-4'>

//                                 <Button
//                                     variant="primary"
//                                     onClick={handleSaveAdditionalCosts}
//                                     disabled={

//                                         additionalCosts.some(cost => !cost.cost_name || Number(cost.cost) < 0) ||
//                                         formik.isSubmitting
//                                     }
//                                 >
//                                     {formik.isSubmitting ? 'Saving...' : 'Save Inventory Cost'}
//                                 </Button>
//                             </div>
//                         </div>

//                     </>
//                 )}
           
//                     <div className='mt-6'>
//                         <div className='px-4 mb-2'>
//                             <p className='text-md text-[#414141] font-medium'>Sales Commission</p>
//                         </div>

//                         <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 px-4'>
//                             <div>
//                                 <Label className='text-black flex items-center gap-1'>Sales Commission % </Label>
//                                 <Input
//                                     name="salescommission"
//                                     placeholder='$ 0.00'
//                                     value={formik.values.salescommission}

//                                     onChange={handleSalesCommisionPriceChange}
//                                     // type="number"
//                                     // min="0"
//                                 />
//                             </div>
//                             {/* <div>
//                                 <Label className='text-black'>Selling Price <span className="text-error-500">*</span></Label>
//                                 <Input
//                                     name="sellingPrice"
//                                     placeholder='$ 0.00'
//                                     value={formik.values.sellingPrice}
//                                     onChange={handleSellingPriceChange}
//                                     type="number"
//                                     min="0"
//                                 />
//                             </div> */}


//                             <div>
//                                 <Label className='flex items-center gap-1'>Profit (Auto calculated) <CiLock className='text-lg' /></Label>
//                                 <Input
//                                     name="profit"
//                                     placeholder='$ 0.00'
//                                     value={formik.values.profit}
//                                     type="number"
//                                     disabled
//                                 />
//                             </div>
//                             <div>
//                                 <Label className='flex items-center gap-1'>Profit % (Auto calculated) <CiLock className='text-lg' /></Label>
//                                 <Input
//                                     name="profit_percentage"
//                                     placeholder='0.00 %'
//                                     value={`${formik.values.profit_percentage}%`}
//                                     disabled
//                                 />
//                             </div>

//                         </div>


//                     </div>
               

//                 {hasPositiveStagePrice && (
//                     <div className='mt-6'>
//                         <div className='px-4 mb-2'>
//                             <p className='text-md text-[#414141] font-medium'>Final Cost & Profit</p>
//                         </div>

//                         <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 px-4'>
//                             <div>
//                                 <Label className='flex items-center gap-1'>Purchase Price <CiLock className='text-lg' /> </Label>
//                                 <Input
//                                     name="price_paid"
//                                     placeholder='$ 0.00'
//                                     value={timelineData?.timeLine[0]?.inventory?.price_paid}
//                                     type="number"
//                                     min="0"
//                                     disabled
//                                 />
//                             </div>
//                             <div>
//                                 <Label className='text-black'>Selling Price <span className="text-error-500">*</span></Label>
//                                 <Input
//                                     name="sellingPrice"
//                                     placeholder='$ 0.00'
//                                     value={formik.values.sellingPrice}
//                                     onChange={handleSellingPriceChange}
//                                     type="number"
//                                     min="0"
//                                 />
//                             </div>


//                             <div>
//                                 <Label className='flex items-center gap-1'> Gross Profit (Auto calculated) <CiLock className='text-lg' /></Label>
//                                 <Input
//                                     name="profit"
//                                     placeholder='$ 0.00'
//                                     value={formik.values.profit}
//                                     type="number"
//                                     disabled
//                                 />
//                             </div>
//                             <div>
//                                 <Label className='flex items-center gap-1'>Gross Profit % (Auto calculated) <CiLock className='text-lg' /></Label>
//                                 <Input
//                                     name="profit_percentage"
//                                     placeholder='$ 0.00'
//                                     value={`${formik.values.profit_percentage}%`}
//                                     disabled
//                                 />
//                             </div>

//                         </div>

//                         <div className='flex items-center gap-3 justify-end mt-4 pr-4'>
//                             <Button onClick={handleCloseReset} variant="fgsoutline">
//                                 Cancel
//                             </Button>
//                             <Button
//                                 variant="primary"
//                                 onClick={handleSellingPriceSubmit}
//                                 disabled={!formik.values.sellingPrice || parseFloat(formik.values.sellingPrice) <= 0}
//                             >
//                                 Mark as Sold
//                             </Button>
//                         </div>
//                     </div>
//                 )}
//             </Box>
//         </Modal>
//     );
// };

// export default AddInventoryCostSummary;