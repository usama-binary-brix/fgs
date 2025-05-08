
import React, { useEffect } from 'react';
import {
    Modal,
    Box,
} from '@mui/material';
import { useParams } from 'next/navigation';
import { useAddInventoryCostMutation, useAddSellingPriceMutation, useCalculateProfitMutation, useGetAllTimelineQuery, useGetInventorySellingPriceQuery } from '@/store/services/api';
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
    const {
        data: sellingPrice,
        error: sellingPriceError,
        isLoading: sellingPriceLoading,
        refetch: sellingPriceRefetch,
    } = useGetInventorySellingPriceQuery(id, {
        skip: !open,
    });

    useEffect(() => {
        if (open) {
            refetch();
            sellingPriceRefetch()
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
                            <Button onClick={onClose} variant="fgsoutline">
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleSellingPriceSubmit}
                                disabled={!formik.values.sellingPrice || parseFloat(formik.values.sellingPrice) <= 0}
                            >
                                Add Final Cost
                            </Button>
                        </div>
                    </div>
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
//     IconButton,
// } from '@mui/material';
// import { useParams } from 'next/navigation';
// import { 
//     useAddAdditionalCostMutation, 
//     useAddInventoryCostMutation, 
//     useAddSellingPriceMutation, 
//     useCalculateProfitMutation, 
//     useGetAllTimelineQuery, 
//     useGetInventorySellingPriceQuery,
  
// } from '@/store/services/api';
// import Input from '@/components/form/input/InputField';
// import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
// import Button from '@/components/ui/button/Button';
// import { RxCross2 } from 'react-icons/rx';
// import { useFormik } from 'formik';
// import { toast } from 'react-toastify';
// import { ErrorResponse } from '../../../accounts/components/AccountsModal';
// import Label from '@/components/form/Label';
// import { FaEdit, FaTrash } from 'react-icons/fa';

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

// interface AdditionalStage {
//     id: number;
//     name: string;
//     price: string | number;
// }

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
//     const [additionalCost, setAdditionalCost] = useState(false);
//     const [additionalStages, setAdditionalStages] = useState<AdditionalStage[]>([]);
//     const [newStageName, setNewStageName] = useState('');
//     const [editingIndex, setEditingIndex] = useState<number | null>(null);
//     const [editStageName, setEditStageName] = useState('');

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

//     const [addAdditionalCost] = useAddAdditionalCostMutation();
//     // const [updateAdditionalCost] = useUpdateAdditionalCostMutation();
//     const [inventoryCost] = useAddInventoryCostMutation();
//     const [calculateProfit] = useCalculateProfitMutation();
//     const [addSellingPrice] = useAddSellingPriceMutation();

//     useEffect(() => {
//         if (open) {
//             refetch();
//             sellingPriceRefetch();
//             // Initialize additional stages from timelineData if available
//             if (timelineData?.additional_cost) {
//                 setAdditionalStages(
//                     timelineData.additional_cost.map((cost: any) => ({
//                         id: cost.id,
//                         name: cost.cost_name,
//                         price: cost.price || ""
//                     }))
//                 );
//             }
            
//         }
//     }, [open, refetch, sellingPriceRefetch, timelineData]);

//     const formik = useFormik({
//         initialValues: {
//             stages: timelineData?.timeLine?.map((stage: any) => ({
//                 stage_id: stage.id,
//                 price: stage.price || ''
//             })) || [],
//             sellingPrice: sellingPrice?.data?.selling_price || '',
//             profit: sellingPrice?.data?.profit || '',
//         },
//         enableReinitialize: true,
//         onSubmit: async (values, { resetForm }) => {
//             try {
//                 // Prepare payload for inventory cost
//                 const payload = {
//                     stages: [
//                         ...values.stages,
//                         ...additionalStages.map(stage => ({
//                             stage_id: stage.id,
//                             price: stage.price || 0
//                         }))
//                     ]
//                 };

//                 const response = await inventoryCost(payload).unwrap();
//                 toast.success(response.message || 'Success');
                
//                 if (sellingPrice?.data?.selling_price) {
//                     await debouncedCalculateProfit(parseFloat(values.sellingPrice));
//                 }

//                 resetForm();
//             } catch (error) {
//                 handleApiError(error);
//             }
//         }
//     });

//     const handleApiError = (error: any) => {
//         const errorResponse = error as ErrorResponse;
//         if (errorResponse?.data?.error) {
//             Object.values(errorResponse.data.error).forEach((errorMessage) => {
//                 if (Array.isArray(errorMessage)) {
//                     errorMessage.forEach((msg) => toast.error(msg));
//                 } else {
//                     toast.error(errorMessage);
//                 }
//             });
//         }
//     };

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
//                 if (sellingPrice <= 0) {
//                     formik.setFieldValue('profit', '');
//                     return;
//                 }

//                 const response = await calculateProfit({
//                     selling_price: sellingPrice,
//                     inventory_id: id
//                 }).unwrap();
//                 formik.setFieldValue('profit', response.profit);
//             } catch (error) {
//                 toast.error('Failed to calculate profit');
//                 formik.setFieldValue('profit', '');
//             }
//         }, 500),
//         [calculateProfit, id]
//     );

//     const handleSellingPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const sellingPrice = parseFloat(e.target.value);
//         formik.setFieldValue('sellingPrice', sellingPrice);
//         debouncedCalculateProfit(sellingPrice);
//     };

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
//             handleApiError(error);
//         }
//     };

//     const handlePriceChange = (index: number, value: string) => {
//         const sanitizedValue = value.replace(/[^0-9.]/g, '');
//         const numValue = parseFloat(sanitizedValue);
//         const finalValue = isNaN(numValue) || numValue < 0 ? "" : numValue;
//         formik.setFieldValue(`stages[${index}].price`, finalValue);
//     };

//     const handleAdditionalStagePriceChange = (index: number, value: string) => {
//         const sanitizedValue = value.replace(/[^0-9.]/g, '');
//         const numValue = parseFloat(sanitizedValue);
//         const finalValue = isNaN(numValue) || numValue < 0 ? "" : numValue;

//         const updatedStages = [...additionalStages];
//         updatedStages[index].price = finalValue;
//         setAdditionalStages(updatedStages);
//     };

//     const handleAddStage = async () => {
//         if (!newStageName.trim()) {
//             toast.error('Please enter a stage name');
//             return;
//         }

//         try {
//             const response = await addAdditionalCost({
//                 inventory_id: id,
//                 cost_name: newStageName.trim()
//             }).unwrap();

//             const newStageItem = {
//                 id: response.data.id, // Use the ID from API response
//                 name: newStageName.trim(),
//                 price: "" // Empty initially
//             };

//             setAdditionalStages([...additionalStages, newStageItem]);
//             setNewStageName('');
//             toast.success(response.message || 'Additional cost added successfully');
//         } catch (error) {
//             handleApiError(error);
//         }
//     };

//     const handleEditStage = (index: number) => {
//         setEditingIndex(index);
//         setEditStageName(additionalStages[index].name);
//     };

//     const handleUpdateStage = async () => {
//         // if (editingIndex === null) return;

//         // if (!editStageName.trim()) {
//         //     toast.error('Please enter a stage name');
//         //     return;
//         // }

//         // try {
//         //     const stageToUpdate = additionalStages[editingIndex];
//         //     const response = await updateAdditionalCost({
//         //         inventory_id: id,
//         //         cost_name: editStageName.trim(),
//         //         additional_cost_id: stageToUpdate.id
//         //     }).unwrap();

//         //     const updatedStages = [...additionalStages];
//         //     updatedStages[editingIndex] = {
//         //         ...updatedStages[editingIndex],
//         //         name: editStageName.trim()
//         //     };

//         //     setAdditionalStages(updatedStages);
//         //     setEditingIndex(null);
//         //     setEditStageName('');
//         //     toast.success(response.message || 'Additional cost updated successfully');
//         // } catch (error) {
//         //     handleApiError(error);
//         // }
//     };

//     const handleCancelEdit = () => {
//         setEditingIndex(null);
//         setEditStageName('');
//     };

//     const handleRemoveStage = (index: number) => {
//         const updatedStages = [...additionalStages];
//         updatedStages.splice(index, 1);
//         setAdditionalStages(updatedStages);
//     };

//     const hasPositiveStagePrice = timelineData?.timeLine?.every((stage: any) =>
//         stage.price && parseFloat(stage.price as unknown as string) >= 0
//     ) && additionalStages.every(stage =>
//         stage.price !== "" // Only check if price is filled (not empty)
//     );

//     if (isLoading) return <div>Loading...</div>;
//     if (error) return <div>Error loading data</div>;

//     return (
//         <Modal open={open} onClose={onClose}>
//             <Box sx={modalStyle}>
//                 <div className='border-b border-gray-400 mb-3 py-3'>
//                     <div className='flex justify-between items-center px-4'>
//                         <p className='text-xl font-semibold'>Inventory Cost Summary</p>
//                         <RxCross2 onClick={onClose} className='cursor-pointer text-3xl' />
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
//                                         <TableCell key={heading} className="px-5 py-3 uppercase text-[#616161] font-medium text-start text-[14px] dark:text-gray-400">
//                                             <div className='w-full flex justify-between items-center'>
//                                                 {heading}
//                                             </div>
//                                         </TableCell>
//                                     ))}
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {timelineData?.timeLine?.map((stage: any, index: number) => (
//                                     <TableRow key={stage.id}>
//                                         <TableCell className='px-4 text-sm text-[#616161] w-110'>{stage.name}</TableCell>
//                                         <TableCell className='px-3 py-2'>
//                                             <Input
//                                                 name={`stages[${index}].price`}
//                                                 placeholder="$ 0.00"
//                                                 value={
//                                                     formik.values.stages[index]?.price === 0
//                                                         ? "0"
//                                                         : formik.values.stages[index]?.price || ""
//                                                 }
//                                                 onChange={(e) => handlePriceChange(index, e.target.value)}
//                                                 onBlur={formik.handleBlur}
//                                                 type="number"
//                                                 min="0"
//                                             />
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>

//                         {additionalCost && (
//                             <>
//                                 <div className="mt-4 border-t pt-4">
//                                     <p className="text-sm font-medium mb-2">
//                                         {editingIndex !== null ? 'Edit Additional Stage Name' : 'Add Additional Stage Name'}
//                                     </p>
//                                     <div className="flex gap-4 items-center">
//                                         <div className="flex-1">
//                                             <Input
//                                                 placeholder="Enter Stage Name"
//                                                 value={editingIndex !== null ? editStageName : newStageName}
//                                                 onChange={(e) =>
//                                                     editingIndex !== null
//                                                         ? setEditStageName(e.target.value)
//                                                         : setNewStageName(e.target.value)
//                                                 }
//                                             />
//                                         </div>
//                                         <div className="">
//                                             {editingIndex !== null ? (
//                                                 <>
//                                                     <Button
//                                                         variant="primary"
//                                                         onClick={handleUpdateStage}
//                                                     >
//                                                         Update
//                                                     </Button>
//                                                     <Button
//                                                         variant="outline"
//                                                         onClick={handleCancelEdit}
//                                                         className="ml-2"
//                                                     >
//                                                         Cancel
//                                                     </Button>
//                                                 </>
//                                             ) : (
//                                                 <Button
//                                                     variant="primary"
//                                                     onClick={handleAddStage}
//                                                 >
//                                                     Add Stage
//                                                 </Button>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {additionalStages.length > 0 && (
//                                     <div className="mt-4">
//                                         <p className="text-sm font-medium mb-2">Set Costs for Additional Stages</p>
//                                         <Table className='border rounded-full'>
//                                             <TableHeader className="sticky top-0 z-50 border-b bg-[#F7F7F7] border-gray-100 dark:border-white/[0.05]">
//                                                 <TableRow>
//                                                     {['Additional Stage Name', 'Cost', 'Actions'].map((heading) => (
//                                                         <TableCell key={heading} className="px-5 py-3 uppercase text-[#616161] font-medium text-start text-[14px] dark:text-gray-400">
//                                                             {heading}
//                                                         </TableCell>
//                                                     ))}
//                                                 </TableRow>
//                                             </TableHeader>
//                                             <TableBody>
//                                                 {additionalStages.map((stage, index) => (
//                                                     <TableRow key={stage.id}>
//                                                         <TableCell className='px-4 text-sm text-[#616161]'>
//                                                             {stage.name}
//                                                         </TableCell>
//                                                         <TableCell className='px-3 py-2'>
//                                                             <Input
//                                                                 placeholder="$ 0.00"
//                                                                 value={stage.price || ""}
//                                                                 onChange={(e) => handleAdditionalStagePriceChange(index, e.target.value)}
//                                                                 type="number"
//                                                                 min="0"
//                                                             />
//                                                         </TableCell>
//                                                         <TableCell className='px-3 py-2'>
//                                                             <div className="flex gap-2">
//                                                                 <IconButton
//                                                                     size="small"
//                                                                     onClick={() => handleEditStage(index)}
//                                                                 >
//                                                                     <FaEdit className="text-gray-600" />
//                                                                 </IconButton>
//                                                                 <IconButton
//                                                                     size="small"
//                                                                     onClick={() => handleRemoveStage(index)}
//                                                                 >
//                                                                     <FaTrash className="text-gray-600" />
//                                                                 </IconButton>
//                                                             </div>
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 ))}
//                                             </TableBody>
//                                         </Table>
//                                     </div>
//                                 )}
//                             </>
//                         )}

//                         <div className='flex items-center gap-3 justify-end mt-4'>
//                             <Button
//                                 variant="primary"
//                                 onClick={() => setAdditionalCost(!additionalCost)}
//                             >
//                                 {additionalCost ? 'Hide Additional Cost' : 'Additional Cost'}
//                             </Button>
//                             <Button
//                                 variant="primary"
//                                 type="submit"
//                                 disabled={!timelineData?.timeLine?.length || formik.isSubmitting}
//                             >
//                                 {formik.isSubmitting ? 'Submitting...' : 'Add Cost'}
//                             </Button>
//                         </div>
//                     </div>
//                 </form>

//                 {hasPositiveStagePrice && (
//                     <div className='mt-6'>
//                         <div className='px-4 mb-2'>
//                             <p className='text-md text-[#414141] font-medium'>Final Cost & Profit</p>
//                         </div>
//                         <div className='grid grid-cols-2 gap-4 px-4'>
//                             <div>
//                                 <Label>Selling Price <span className="text-error-500">*</span></Label>
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
//                                 <Label>Profit (Auto calculated)</Label>
//                                 <Input
//                                     name="profit"
//                                     placeholder='$ 0.00'
//                                     value={formik.values.profit}
//                                     type="number"
                                 
//                                 />
//                             </div>
//                         </div>
//                         <div className='flex items-center gap-3 justify-end mt-4 pr-4'>
//                             <Button onClick={onClose} variant="outline">
//                                 Cancel
//                             </Button>
//                             <Button
//                                 variant="primary"
//                                 onClick={handleSellingPriceSubmit}
//                                 disabled={!formik.values.sellingPrice || parseFloat(formik.values.sellingPrice) <= 0}
//                             >
//                                 Add Final Cost
//                             </Button>
//                         </div>
//                     </div>
//                 )}
//             </Box>
//         </Modal>
//     );
// };

// export default AddInventoryCostSummary;