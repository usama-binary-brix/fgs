'use client';
import React, { useEffect, useState } from 'react';
import { Modal, Box, Grid, CircularProgress } from '@mui/material';
import { RxCross2 } from "react-icons/rx";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useAddInventoryMutation, useAddTaskStatusMutation, useGetTaskByIdQuery } from '@/store/services/api';
import Label from '@/components/form/Label';
import TextArea from './form/input/TextArea';
import Button from '@/components/ui/button/Button';

const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '30%',
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingY: '10px',
    overflowY: 'auto',
    borderRadius: 2,
};

interface Props {
    open: boolean;
    onClose: () => void;
    taskName?:any
    taskId?:any
}

type ErrorResponse = {
    data: {
        error: Record<string, string>;
    };
};

const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
];

const UpdateTaskStatusModal: React.FC<Props> = ({ open, onClose, taskName, taskId }) => {
    const [images, setImages] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [addStatus] = useAddTaskStatusMutation();


    const { data: taskData, error: taskError, isLoading: taskLoading, refetch: taskRefetch } = useGetTaskByIdQuery(taskId, { skip: !taskId });

    useEffect(() => {
        if (!open) {
            setImages([]);
            formik.resetForm();
        }
    }, [open]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setImages([...images, ...Array.from(files)]);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const validationSchema = Yup.object().shape({
        status: Yup.string().required('Status is required'),
        // note: Yup.string().required('Description is required'),
    });

    const formik = useFormik({
        initialValues: {
            status: '',
            description: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            console.log(values, 'values')
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append('task_id', taskId);
        
            Object.entries(values).forEach(([key, value]) => {
                formData.append(key, value as string);
            });
            images.forEach((image) => {
                formData.append("files[]", image);
            });
            
            try {
               const response = await addStatus(formData).unwrap();
                toast.success(response.message || 'Task status updated successfully!');
                onClose();
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
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    const getFileTypeIcon = (fileUrl: string): string | undefined => {
        if (!fileUrl) return undefined;
        const lowerCaseFileUrl = fileUrl.toLowerCase();

        if (lowerCaseFileUrl.endsWith('.pdf')) {
            return '/images/filesicon/pdff.png';
        }
        if (lowerCaseFileUrl.endsWith('.doc') || lowerCaseFileUrl.endsWith('.docx')) {
            return '/images/filesicon/docss.png';
        }
        if (lowerCaseFileUrl.endsWith('.xls') || lowerCaseFileUrl.endsWith('.xlsx')) {
            return '/images/filesicon/xlsx.png';
        }
        if (
            lowerCaseFileUrl.endsWith('.jpg') ||
            lowerCaseFileUrl.endsWith('.jpeg') ||
            lowerCaseFileUrl.endsWith('.png') ||
            lowerCaseFileUrl.endsWith('.gif') ||
            lowerCaseFileUrl.endsWith('.svg') ||
            lowerCaseFileUrl.endsWith('.webp')
        ) {
            return '/images/fileupload.svg';
        }
        return '/images/filesicon/docss.png';
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <div className='border-b border-gray-400 mb-3 py-3'>
                    <div className='flex justify-between items-center px-4'>
                        <p className='text-xl font-semibold'>{taskName}</p>
                        <RxCross2 onClick={onClose} className='cursor-pointer text-3xl' />
                    </div>
                </div>
                <form onSubmit={formik.handleSubmit} className='p-[15px]' autoComplete='off'>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                            <Label>Status <span className="text-error-500">*</span></Label>
                            <select
                                className="w-full h-9 p-2 border border-gray-300 rounded-sm text-sm"
                                name="status"
                                value={formik.values.status}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option className='text-[#414141]' value="">Select status</option>
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {formik.touched.status && formik.errors.status && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.status}</div>
                            )}
                        </Grid>
                        
                        <Grid item xs={12}>
                            <Label>Note</Label>
                            <TextArea
                                placeholder="Enter your note"
                                rows={3}
                                value={formik.values.description}
                                onChange={(value) => formik.setFieldValue("description", value)}
                                onBlur={() => formik.setFieldTouched("description", true)}
                                error={formik.touched.description && Boolean(formik.errors.description)}
                                hint={formik.touched.description ? formik.errors.description : ""}
                                disabled={formik.isSubmitting}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <div className="w-full">
                                <h1 className="text-sm text-[#414141] font-medium text-[13px] font-family">Attach Files</h1>
                                <p className="text-[#818181] text-[10px] font-family font-normal">Only PDF, JPG & PNG formats are allowed</p>
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#B1BFD0] rounded-lg cursor-pointer mt-3 hover:bg-gray-100">
                                    <input
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                    <div className="text-center">
                                        <p className="text-gray-700 font-semibold text-xs">Drop your files here,</p>
                                        <p className="text-blue-600 underline text-xs">or browse</p>
                                    </div>
                                </label>

                                {images.length > 0 && (
                                    <div className="flex gap-4 mt-4 flex-wrap">
                                        {images.map((img, index) => {
                                            const isImage = img.type.startsWith('image/');
                                            const previewSrc = isImage ? URL.createObjectURL(img) : getFileTypeIcon(img.name);
                                            const fileName = img.name;
                                            return (
                                                <div key={index} className="relative w-24 h-24">
                                                    <div className="h-full rounded-lg overflow-hidden border border-gray-200">
                                                        <img
                                                            src={previewSrc}
                                                            alt={`Uploaded preview ${index}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <button
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                removeImage(index);
                                                            }}
                                                        >
                                                            <RxCross2 className="text-xs" />
                                                        </button>
                                                    </div>
                                                    <p className="text-xs text-center mt-1 truncate w-full" title={fileName}>
                                                        {fileName}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </Grid>

                        <Grid item xs={12} display="flex" justifyContent="flex-end">
                            <div className='flex items-center gap-4'>
                                <Button onClick={onClose} variant="fgsoutline" className='font-semibold'>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className='font-semibold'
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Processing..." : "Update"}
                                </Button>
                            </div>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};

export default UpdateTaskStatusModal;