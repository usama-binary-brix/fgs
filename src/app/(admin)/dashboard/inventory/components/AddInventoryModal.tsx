'use client';
import React, { useEffect, useState } from 'react';
import { Modal, Box, Grid, Button, CircularProgress } from '@mui/material';
import { RxCross2 } from "react-icons/rx";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import {
    useGetAllCategoriesQuery,
    useGetSubCategoriesMutation,
    useAddInventoryMutation
} from '@/store/services/api';

const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto',
    borderRadius: 2,
};

interface Props {
    open: boolean;
    onClose: () => void;
}

const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginTop: '8px',
};

const selectStyle = {
    ...inputStyle,
};

const AddInventoryModal: React.FC<Props> = ({ open, onClose }) => {
    const [images, setImages] = useState<File[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [subCategories, setSubCategories] = useState<any>([]);

    const { data: categories, isLoading: loadingCategories } = useGetAllCategoriesQuery(null, { skip: !open });
    const [fetchSubCategories] = useGetSubCategoriesMutation();
    const [addInventory] = useAddInventoryMutation();

    useEffect(() => {
        if (!open) {
            setSelectedCategory('');
            setSubCategories([]);
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

    const handleCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const categoryId = e.target.value;
        formik.setFieldValue("category_id", categoryId);

        if (categoryId) {
            try {
                const response = await fetchSubCategories(categoryId).unwrap();
                setSubCategories(response);
            } catch (error) {
                console.error("Failed to fetch subcategories", error);
            }
        } else {
            setSubCategories([]);
        }
    };
    const validationSchema = Yup.object().shape({
        category_id: Yup.string().required('Category is required'),
        subcategory_id: Yup.string().required('Subcategory is required'),
        year: Yup.string().required('Year is required'),
        make: Yup.string().required('Make is required'),
        model: Yup.string().required('Model is required'),
        serial_no: Yup.string().required('Serial No is required'),
        length: Yup.string().required('Length is required'),
        height: Yup.string().required('Height is required'),
        width: Yup.string().required('Width is required'),
        weight: Yup.string().required('Weight is required'),
        hours: Yup.string().required('Hours are required'),
        price_paid: Yup.string().required('Price paid is required'),
        date_purchased: Yup.date().required('Purchase date is required').typeError('Invalid date format'),
        condition: Yup.string().required('Condition is required'),
        description: Yup.string().required('Description is required'),
        location: Yup.string().required('Location is required'),
    });
    console.log('first', categories?.categories)
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
            condition: '',
            description: '',
            location: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                formData.append(key, value as string);
            });

            images.forEach((image) => {
                formData.append('files', image);
            });

            try {
                await addInventory(formData).unwrap();
                toast.success('Inventory added successfully!');
                onClose();
            } catch (error) {
                toast.error('Failed to add inventory');
                console.error("Error submitting form:", error);
            }
        },
    });

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <div className='flex justify-between items-center mb-3 border-b border-gray-400 pb-3'>
                    <p className='text-[18px] text-black font-semibold font-family'>Add New Inventory</p>
                    <RxCross2 onClick={onClose} className='cursor-pointer text-[#616161] text-3xl' />
                </div>

                <form onSubmit={formik.handleSubmit} autoComplete='off'>
                    <Grid container spacing={2}>
                        <Grid item xs={6} md={4}>
                            <label className='text-[12.5px] text-[#818181] font-normal font-family'>Category 

            <span className='text-red-500'> *</span>

                            </label>
                            <select name="category_id" style={selectStyle} value={formik.values.category_id} onChange={handleCategoryChange}>
                                <option value="">Select</option>
                                {categories?.categories?.map((category: any) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </Grid>

                        <Grid item xs={6} md={4}>
                            <label className='text-[12.5px] text-[#818181] font-normal font-family'>SubCategory 
                            <span className='text-red-500'> *</span>


                            </label>
                            <select name="subcategory_id" style={inputStyle} value={formik.values.subcategory_id} onChange={formik.handleChange}>
                                <option value="">Select</option>
                                {subCategories?.categories?.map((sub: any) => (
                                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                                ))}
                            </select>
                        </Grid>

                        {["year", "make", "model", "serial_no", "length", "height", "width", "weight", "hours", "price_paid", "condition", "description", "location"].map((field) => (
                            <Grid item xs={6} md={4} key={field}>
 <label className='capitalize text-[12.5px] text-[#818181] font-normal font-family'>
            {field.replace("_", " ")} 
            <span className='text-red-500'> *</span>
        </label>                                <input
                                    type="text"
                                    name={field}
                                    style={inputStyle}
                                    value={formik.values[field as keyof typeof formik.values]} // ✅ Fix
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className='border-1 border-[#E8E8E8]'
                                />
                                {formik.touched[field as keyof typeof formik.values] && formik.errors[field as keyof typeof formik.errors] && (
                                    <p className="text-red-500">{formik.errors[field as keyof typeof formik.errors]}</p>
                                )}
                            </Grid>
                        ))}

                        <Grid item xs={6} md={4}>
                            <label className='text-[12.5px] text-[#818181] font-normal font-family'>Purchase Date *</label>
                            <input
                                type="date"
                                name="date_purchased"
                                style={inputStyle}
                                value={formik.values.date_purchased}
                                onChange={formik.handleChange}
                            />
                            {formik.errors.date_purchased && <p className="text-red-500">{formik.errors.date_purchased}</p>}
                        </Grid>


                        <Grid xs={12} md={12} mt={2} ml={2}>
                            <div>
                                <h1 className="text-sm text-black font-normal text-[12.5px] font-family">Attach Files</h1>
                                <p className="text-custom-lightGray text-[10px] font-family font-normal">Only PDF, JPG & PNG formats are allowed</p>
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer h-[103px] px-2 hover:bg-gray-100">
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg, application/pdf"
                                        multiple
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                    <div className="text-center">
                                        <p className="text-gray-700 font-semibold text-xs">Drop your image here,</p>
                                        <p className="text-blue-600 underline text-xs">or browse</p>
                                    </div>
                                </label>

                                {images.length > 0 && (
                                    <div className="flex gap-4 mt-0 flex-wrap">
                                        {images.map((img, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={URL.createObjectURL(img)}
                                                    alt={`Uploaded preview ${index}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-lg p-1"
                                                    onClick={() => removeImage(index)}
                                                >
                                                    <RxCross2/>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Grid>
                        <Grid item xs={12} display="flex" justifyContent="flex-end" mt={2}>
                            <Button className='!bg-[#8080801A] !font-family !border-1 !border-[#8080801A] !text-[#808080] !rounded' onClick={onClose} variant="outlined" sx={{ mr: 2, textTransform: 'none' }}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ backgroundColor: '#C28024', '&:hover': { backgroundColor: '#a56a1d' }, textTransform: 'none' }}
                            >
                                Add Inventory

                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};

export default AddInventoryModal;
