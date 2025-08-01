'use client';
import React, { useEffect, useState } from 'react';
import { Modal, Box, Grid, CircularProgress } from '@mui/material';
import { RxCross2 } from "react-icons/rx";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import {
    useGetAllCategoriesQuery,
    useGetSubCategoriesMutation,
    useAddInventoryMutation
} from '@/store/services/api';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import CustomDatePicker from '@/components/CustomDatePicker';
import MuiDatePicker from '@/components/CustomDatePicker';
import { PageTitle } from '@/components/PageTitle';
import Button from '@/components/ui/button/Button';
import { modalStyles } from '../../accounts/components/AccountsModal';

const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
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
}

const inputStyle = {
    width: '100%',
    padding: '6px',
    borderRadius: '2px',
    // border: '1px solid #ccc',
    // marginTop: '8px',

};

type ErrorResponse = {
    data: {
        error: Record<string, string>; // `error` contains field names as keys and error messages as values
    };
};

type SUbCategoriesErrorResponse = {
    data: {
        message: string | Record<string, string>;
    };
};


const selectStyle = {
    ...inputStyle,
};

const AddInventoryModal: React.FC<Props> = ({ open, onClose }) => {
    const [images, setImages] = useState<File[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [subCategories, setSubCategories] = useState<any>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const currentYear = new Date().getFullYear();
    const { data: categories, isLoading: loadingCategories } = useGetAllCategoriesQuery(null, { skip: !open });
    const [fetchSubCategories] = useGetSubCategoriesMutation();
    const [addInventory] = useAddInventoryMutation();


  const fields = [
    { name: "year", label: "Year" },
    { name: "make", label: "Make" },
    { name: "model", label: "Model" },
    { name: "serial_no", label: "Serial No" },
    { name: "length", label: "Length (feet)" },
    { name: "height", label: "Height (feet)" },
    { name: "width", label: "Width (feet)" },
    { name: "weight", label: "Weight" },
    { name: "hours", label: "Hours" },
    { name: "price_paid", label: "Price Paid" },
  ];
    useEffect(() => {
        if (!open) {
            setSelectedCategory('');
            setSubCategories([]);
            setImages([]);
            setIsDragOver(false);
            formik.resetForm();
        }
    }, [open]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const allowedTypes = [
                'image/jpeg',
                'image/jpg', 
                'image/png',
                'image/gif',
                'image/webp',
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ];
            
            const allowedFiles = Array.from(files).filter(file => allowedTypes.includes(file.type));
            
            if (allowedFiles.length !== Array.from(files).length) {
                toast.error('Some files were skipped. Only images, PDF, DOC, DOCX, XLS, and XLSX files are allowed.');
            }
            
            if (allowedFiles.length > 0) {
                setImages([...images, ...allowedFiles]);
            }
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    // Drag and drop handlers
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        
        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) {
            // Filter files to only accept allowed types
            const allowedFiles = droppedFiles.filter(file => {
                const allowedTypes = [
                    'image/jpeg',
                    'image/jpg',
                    'image/png',
                    'image/gif',
                    'image/webp',
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                ];
                return allowedTypes.includes(file.type);
            });
            
            if (allowedFiles.length !== droppedFiles.length) {
                toast.error('Some files were skipped. Only images, PDF, DOC, DOCX, XLS, and XLSX files are allowed.');
            }
            
            if (allowedFiles.length > 0) {
                setImages([...images, ...allowedFiles]);
            }
        }
    };

    // Click handler to trigger file input
    const handleClick = () => {
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) {
            fileInput.click();
        }
    };

    // Custom handlers for dimension fields
    const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        
        // Only allow numbers and decimal point
        const filteredValue = value.replace(/[^0-9.]/g, '');
        
        // Prevent multiple decimal points
        const parts = filteredValue.split('.');
        if (parts.length > 2) {
            return; // Don't update if more than one decimal point
        }
        
        // Only allow non-negative numbers
        const numValue = parseFloat(filteredValue);
        if (filteredValue === '' || (numValue >= 0)) {
            formik.setFieldValue('length', filteredValue);
        }
    };

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        
        // Only allow numbers and decimal point
        const filteredValue = value.replace(/[^0-9.]/g, '');
        
        // Prevent multiple decimal points
        const parts = filteredValue.split('.');
        if (parts.length > 2) {
            return; // Don't update if more than one decimal point
        }
        
        // Only allow non-negative numbers
        const numValue = parseFloat(filteredValue);
        if (filteredValue === '' || (numValue >= 0)) {
            formik.setFieldValue('height', filteredValue);
        }
    };

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        
        // Only allow numbers and decimal point
        const filteredValue = value.replace(/[^0-9.]/g, '');
        
        // Prevent multiple decimal points
        const parts = filteredValue.split('.');
        if (parts.length > 2) {
            return; // Don't update if more than one decimal point
        }
        
        // Only allow non-negative numbers
        const numValue = parseFloat(filteredValue);
        if (filteredValue === '' || (numValue >= 0)) {
            formik.setFieldValue('width', filteredValue);
        }
    };

    const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        
        // Only allow numbers and decimal point
        const filteredValue = value.replace(/[^0-9.]/g, '');
        
        // Prevent multiple decimal points
        const parts = filteredValue.split('.');
        if (parts.length > 2) {
            return; // Don't update if more than one decimal point
        }
        
        // Only allow non-negative numbers
        const numValue = parseFloat(filteredValue);
        if (filteredValue === '' || (numValue >= 0)) {
            formik.setFieldValue('weight', filteredValue);
        }
    };

    const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        
        // Only allow numbers and decimal point
        const filteredValue = value.replace(/[^0-9.]/g, '');
        
        // Prevent multiple decimal points
        const parts = filteredValue.split('.');
        if (parts.length > 2) {
            return; // Don't update if more than one decimal point
        }
        
        // Only allow non-negative numbers
        const numValue = parseFloat(filteredValue);
        if (filteredValue === '' || (numValue >= 0)) {
            formik.setFieldValue('hours', filteredValue);
        }
    };

    const handlePricePaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        
        // Only allow numbers and decimal point
        const filteredValue = value.replace(/[^0-9.]/g, '');
        
        // Prevent multiple decimal points
        const parts = filteredValue.split('.');
        if (parts.length > 2) {
            return; // Don't update if more than one decimal point
        }
        
        // Only allow non-negative numbers
        const numValue = parseFloat(filteredValue);
        if (filteredValue === '' || (numValue >= 0)) {
            formik.setFieldValue('price_paid', filteredValue);
        }
    };

    const handleSerialNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only alphanumeric characters and hyphens
        const filteredValue = value.replace(/[^a-zA-Z0-9-]/g, '');
        formik.setFieldValue('serial_no', filteredValue);
    };

    const handleCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const categoryId = e.target.value;
        formik.setFieldValue("category_id", categoryId);
        formik.setFieldValue("subcategory_id", '');
        setSubCategories([]);
        if (categoryId) {
            try {
                const response = await fetchSubCategories(categoryId).unwrap();
                setSubCategories(response);
            } catch (error) {
                const errorResponse = error as SUbCategoriesErrorResponse;


                // if (errorResponse?.data?.message) {
                //     const message = errorResponse.data.message;

                //     if (typeof message === 'string') {
                //         toast.error(message);
                //     } else if (typeof message === 'object') {
                //         const combined = Object.values(message).join(', ');
                //         toast.error(combined);
                //     }
                // }
            }
        } else {
            setSubCategories([]);
        }
    };
    const validationSchema = Yup.object().shape({
        category_id: Yup.string().required('Category is required'),
        // subcategory_id: Yup.string().required('Subcategory is required'),

        year: Yup.number()
            .required('Year is required')
            .max(9999, 'Maximum 4 digits allowed')
            .typeError('Year must be a number')
            .max(currentYear, `Year cannot be greater than ${currentYear}`),

        make: Yup.string()
            .required('Make is required')
            // .max(9999, 'Maximum 4 digits allowed')
            // .typeError('Year must be a number')
            // .max(currentYear, `Year cannot be greater than ${currentYear}`)
        ,
        model: Yup.string().required('Model is required'),
        serial_no: Yup.string()
            .required('Serial No is required')
            .matches(/^[a-zA-Z0-9-]+$/, 'Serial number can only contain letters, numbers, and hyphens'),
        length: Yup.number()
            .typeError('Length must be a number')
            .min(0, 'Length cannot be negative')
            .required('Length is required'),
        height: Yup.number()
            .typeError('Height must be a number')
            .min(0, 'Height cannot be negative')
            .required('Height is required'),
        width: Yup.number()
            .typeError('Width must be a number')
            .min(0, 'Width cannot be negative')
            .required('Width is required'),
        weight: Yup.number()
            .typeError('Weight must be a number')
            .min(0, 'Weight cannot be negative')
            .required('Weight is required'),
        hours: Yup.number()
            .typeError('Hours must be a number')
            .min(0, 'Hours cannot be negative')
            .required('Hours are required'),
        price_paid: Yup.number()
            .typeError('Price paid must be a number')
            .min(0, 'Price paid cannot be negative')
            .required('Price paid is required'),
        date_purchased: Yup.date().required('Purchase date is required').typeError('Invalid date format'),

    });
    const formik = useFormik({
        initialValues: {
            category_id: '',
            subcategory_id: '',
            year: '',
            make: '',
            model: '',
            serial_no: '',
            length: '',
            height: '',
            width: '',
            weight: '',
            hours: '',
            price_paid: '',
            date_purchased: '',

        },
        validationSchema,
        onSubmit: async (values) => {
            setIsSubmitting(true); // start processing
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                formData.append(key, value as string);
            });
            images.forEach((image) => {
                formData.append("files[]", image);
            });
            try {
                await addInventory(formData).unwrap();
                toast.success('Inventory added successfully!');
                onClose();
            } catch (error) {

                const errorResponse = error as ErrorResponse;


                if (errorResponse?.data?.error) {
                    Object.values(errorResponse.data.error).forEach((errorMessage) => {
                        if (Array.isArray(errorMessage)) {
                            errorMessage.forEach((msg) => toast.error(msg)); // Handle array errors
                        } else {
                            toast.error(errorMessage); // Handle single string errors
                        }
                    });
                }

            }
            finally {
                setIsSubmitting(false); // stop processing
            }
        },
    });


    const getFileTypeIcon = (fileUrl: string): string | undefined => {
        if (!fileUrl) return undefined;

        const lowerCaseFileUrl = fileUrl.toLowerCase();


        if (lowerCaseFileUrl.endsWith('.pdf')) {
            return '/images/filesicon/pdff.png';
        }
        if (
            lowerCaseFileUrl.endsWith('.doc') ||
            lowerCaseFileUrl.endsWith('.docx')
        ) {
            return '/images/filesicon/docss.png';
        }
        if (
            lowerCaseFileUrl.endsWith('.xls') ||
            lowerCaseFileUrl.endsWith('.xlsx')
        ) {
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
            return '/images/fileupload.svg'; // Image preview
        }

        // default fallback
        return '/images/filesicon/docss.png';
    };


    return (
        <Modal open={open} onClose={onClose}>
       <Box className={`${modalStyles.base} ${modalStyles.sizes.default}`}>
                <div className=' border-b border-gray-400 mb-3 py-3'>
                    <div className='flex justify-between items-center px-4'>
                        <p className='text-xl font-semibold'>Add New Inventory</p>
                        <RxCross2 onClick={onClose} className='cursor-pointer text-3xl' />

                    </div>
                </div>
                <form onSubmit={formik.handleSubmit} className='p-[15px]' autoComplete='off'>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>

                            <Label>Category <span className="text-error-500">*</span></Label>

                            <select
                                className="w-full h-9 p-2  border border-gray-300 rounded-sm text-sm"

                                name="category_id"
                                value={formik.values.category_id} onChange={handleCategoryChange}>
                                <option className='text-[#414141] ' value="">Select an option</option>
                                {categories?.categories?.map((category: any) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Label> Sub Category</Label>
                            <Select
                                name="subcategory_id"
                                value={formik.values.subcategory_id}
                                options={
                                    subCategories?.categories?.map((sub: any) => ({
                                        value: sub.id.toString(),
                                        label: sub.name,
                                    })) || []
                                }
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                // disabled={!subCategories?.categories || subCategories.categories.length === 0}
                            />

                        </Grid>

                        {fields.map(({ name, label }) => (
                            <Grid item xs={12} md={4}>

                <div key={name}>
                  <Label className="capitalize">
                    {label} <span className="text-red-600">*</span>
                  </Label>

                  <div className="relative flex items-center">
                    <input
                      type="text"
                      name={name}
                      value={formik.values[name as keyof typeof formik.values] || ""}
                      onChange={(e) => {
                        if (name === 'length') {
                          handleLengthChange(e);
                        } else if (name === 'height') {
                          handleHeightChange(e);
                        } else if (name === 'width') {
                          handleWidthChange(e);
                        } else if (name === 'weight') {
                          handleWeightChange(e);
                        } else if (name === 'hours') {
                          handleHoursChange(e);
                        } else if (name === 'price_paid') {
                          handlePricePaidChange(e);
                        } else if (name === 'serial_no') {
                          handleSerialNoChange(e);
                        } else {
                          formik.handleChange(e);
                        }
                      }}
                      onBlur={formik.handleBlur}
                      className="h-9 w-full rounded-sm border appearance-none px-4 py-1 text-sm shadow-theme-xs text-black placeholder:text-gray-400 focus:outline-hidden focus:ring-1 pr-10"
                    />
                    {["length", "height", "width"].includes(name) && (
        <span className="absolute right-3 text-sm text-gray-600">feet</span>
      )}
                    {name === "weight" && (
        <span className="absolute right-3 text-sm text-gray-600">lbs</span>
      )}
                    {name === "hours" && (
        <span className="absolute right-3 text-sm text-gray-600">hrs</span>
      )}
                    {name === "price_paid" && (
        <span className="absolute right-3 text-sm text-gray-600">$</span>
      )}
                  </div>

                  {formik.touched[name as keyof typeof formik.values] &&
                    formik.errors[name as keyof typeof formik.errors] && (
                      <p className="text-red-500 text-sm">
                        {formik.errors[name as keyof typeof formik.errors]}
                      </p>
                    )}
                </div>
                            </Grid>

              ))}

                        {/* {["year", "make", "model", "serial_no", "length", "height", "width", "weight", "hours", "price_paid",].map((field) => (
                            <Grid item xs={12} md={4} key={field}>
                                <Label className='capitalize'>
                                    {field.replace("_", " ")}
                                    <span className='text-red-500'> *</span>
                                </Label>
                                <Input
                                    type="text"
                                    name={field}
                                    value={formik.values[field as keyof typeof formik.values]}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    maxLength={["year"].includes(field) ? 4 : undefined}
                                    className='border-1 border-[#E8E8E8]  focus:outline-none focus:border-[#E8E8E8] text-[#414141]'
                                />
                                {formik.touched[field as keyof typeof formik.values] && formik.errors[field as keyof typeof formik.errors] && (
                                    <p className="text-red-500">{formik.errors[field as keyof typeof formik.errors]}</p>
                                )}
                            </Grid>
                        ))} */}

                        <Grid item xs={12} md={4}>
                            <Label>Date Purchased <span className="text-red-500">*</span></Label>
                            <MuiDatePicker
                                name="date_purchased"
                                value={formik.values.date_purchased}
                                onChange={(value) => {
                                    formik.setFieldValue("date_purchased", value);
                                }}
                                // disablePast={true}    
                            />

                            {formik.touched.date_purchased && formik.errors.date_purchased && (
                                <p className="text-red-500">{formik.errors.date_purchased}</p>
                            )}                        </Grid>
                        <Grid xs={12} md={12} mt={2} ml={2}>
                            <div>
                                <h1 className="text-sm text-[#414141] font-medium text-[13px] font-family">Attach Files</h1>
                                <p className="text-[#818181] text-[10px] font-family font-normal">Only images (JPG, PNG, GIF, WebP), PDF, DOC, DOCX, XLS, and XLSX formats are allowed</p>
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                                <div
                                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer h-30 w-35 transition-all duration-200 ${
                                        isDragOver 
                                            ? 'border-blue-500 bg-blue-50' 
                                            : 'border-[#B1BFD0] hover:bg-gray-100'
                                    }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={handleClick}
                                >
                                    <input
                                        type="file"
                                        id="file-input"
                                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                        multiple
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />

                                    <div className="text-center">
                                        <p className="text-gray-700 font-semibold text-xs">
                                            {isDragOver ? 'Drop files here' : 'Drop your files here,'}
                                        </p>
                                        <p className="text-blue-600 underline text-xs">or browse</p>
                                    </div>
                                </div>

                                {images.length > 0 && (
                                    <div className="flex gap-4 mt-0 flex-wrap">
                                        {images.map((img, index) => {
                                            const isImage = img.type.startsWith('image/');
                                            const previewSrc = isImage ? URL.createObjectURL(img) : getFileTypeIcon(img.name);
                                            const fileName = img.name;
                                            return (
                                                <div key={index} className="relative w-35">
                                                    <div className="h-30 rounded-lg overflow-hidden">
                                                        <img
                                                            src={previewSrc}
                                                            alt={`Uploaded preview ${index}`}
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                        <button
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                                            onClick={() => removeImage(index)}
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
                                <Button onClick={onClose} variant="fgsoutline"
                                    className='font-semibold'
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className='font-semibold'
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <div className=" flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
          </div> : "Add Inventory"}
                                </Button>
                            </div>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};

export default AddInventoryModal;
