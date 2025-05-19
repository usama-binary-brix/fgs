'use client';
import React, { useEffect, useState } from 'react';
import { Modal, Box, Grid, CircularProgress } from '@mui/material';
import { RxCross2 } from "react-icons/rx";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useAddInventoryMutation, useAddTaskStatusMutation, useEmployeeTaskStatusQuery, useGetTaskByIdQuery } from '@/store/services/api';
import Label from '@/components/form/Label';
import TextArea from './form/input/TextArea';
import Button from '@/components/ui/button/Button';
import ButtonLoader from './ButtonLoader';

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


export const statusModalStyles = {
    base: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl rounded-lg overflow-y-auto",
    sizes: {
        default: "w-[85%] sm:w-[60%] md:w-[30%] lg:w-[30%] max-h-[80vh] md:max-h-[90vh]",

    },
    header: "sticky top-0 z-10 bg-white border-b border-gray-400 py-3 px-4",
    content: "px-4 py-4 overflow-y-auto",
    title: "text-lg sm:text-xl font-semibold",
    closeButton: "cursor-pointer text-2xl sm:text-3xl text-gray-600 hover:text-gray-900"
} as const;




interface Props {
    open: boolean;
    onClose: () => void;
    taskName?: any
    taskId?: any
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
    const [existingFiles, setExistingFiles] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [addStatus] = useAddTaskStatusMutation();
    const { data: taskStatusData, error: taskStatusError, isLoading: taskStatusLoading, refetch: taskStatusRefetch } = useEmployeeTaskStatusQuery(taskId, { skip: !taskId || !open });
  
    // Reset all local state when modal closes
    const resetFormState = () => {
        setImages([]);
        setExistingFiles([]);
        formik.resetForm();
    };

    // Fetch data when modal opens or taskId changes
    useEffect(() => {
        if (open) {
            taskStatusRefetch();
        }
    }, [open, taskId]);

    // Update form with API data when it's available
    useEffect(() => {
        if (taskStatusData?.employee_task_status) {
            const statusData = taskStatusData.employee_task_status;
            formik.setValues({
                status: statusData.status || '',
                description: statusData.description || ''
            });
            if (statusData.files && statusData.files.length > 0) {
                setExistingFiles(statusData.files.map((file: any) => file.file));
            } else {
                setExistingFiles([]);
            }
            setImages([]); // Clear any uploaded images when loading new data
        } else if (!taskStatusData) {
            // If no data found, reset to empty state
            formik.resetForm();
            setExistingFiles([]);
            setImages([]);
        }
    }, [taskStatusData, taskStatusLoading, open]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setImages([...images, ...Array.from(files)]);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const removeExistingFile = (index: number) => {
        setExistingFiles(existingFiles.filter((_, i) => i !== index));
    };

    const validationSchema = Yup.object().shape({
        status: Yup.string().required('Status is required'),
    });

    const handleClose = () => {
        resetFormState();
        onClose();
    };

    const formik = useFormik({
        initialValues: {
            status: '',
            description: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append('task_id', taskId);

            // Append existing file URLs that haven't been removed
            existingFiles.forEach((fileUrl) => {
                formData.append("existing_images[]", fileUrl);
            });

            Object.entries(values).forEach(([key, value]) => {
                formData.append(key, value as string);
            });
            
            images.forEach((image) => {
                formData.append("files[]", image);
            });

            if (taskStatusData?.employee_task_status) {
                formData.append('status_id', `${taskStatusData.employee_task_status.id}`);
            }

            try {
                const response = await addStatus(formData).unwrap();
                toast.success(response.message || 'Task status updated successfully!');
                resetFormState();
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
        if (lowerCaseFileUrl.match(/\.(jpg|jpeg|png|gif|svg|webp|JPG|jfif)$/)) {
            return fileUrl;
        }
        return '/images/filesicon/docss.png';
    };

    return (
        <Modal open={open} onClose={handleClose}>
       <Box className={`${statusModalStyles.base} ${statusModalStyles.sizes.default}`}>
                <div className='border-b border-gray-400 mb-3 py-3'>
                    <div className='flex justify-between items-center px-4'>
                        <p className='text-xl font-semibold'>{taskName}</p>
                        <RxCross2 onClick={handleClose} className='cursor-pointer text-3xl' />
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
                            <Label>Notes</Label>
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
                            <Label>Attach Files</Label>
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

                                {(images.length > 0 || existingFiles.length > 0) && (
                                    <div className="flex gap-4 mt-4 flex-wrap">
                                        {/* Render existing files */}
                                        {existingFiles.map((fileUrl, index) => {
                                            const previewSrc = getFileTypeIcon(fileUrl);
                                            const fileName = fileUrl.split('/').pop();
                                            return (
                                                <div key={`existing-${index}`} className="relative w-24 h-24">
                                                    <div className="h-full rounded-lg overflow-hidden border border-gray-200">
                                                        <img
                                                            src={previewSrc}
                                                            alt={`Existing file ${index}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                removeExistingFile(index);
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

                                        {/* Render newly uploaded files */}
                                        {images.map((img, index) => {
                                            const isImage = img.type.startsWith('image/');
                                            const previewSrc = isImage ? URL.createObjectURL(img) : getFileTypeIcon(img.name);
                                            const fileName = img.name;
                                            return (
                                                <div key={`new-${index}`} className="relative w-24 h-24">
                                                    <div className="h-full rounded-lg overflow-hidden border border-gray-200">
                                                        <img
                                                            src={previewSrc}
                                                            alt={`Uploaded preview ${index}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <button
                                                            type="button"
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

                        <Grid item xs={12} display="flex" justifyContent="flex-end" marginTop={'1rem'}>
                            <div className='flex items-center gap-4'>
                                <Button type="button" onClick={handleClose} variant="fgsoutline" className='font-semibold'>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className='font-semibold'
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <ButtonLoader/>: "Update"}
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