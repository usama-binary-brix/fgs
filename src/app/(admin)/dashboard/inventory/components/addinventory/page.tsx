'use client';
import React, { useState } from 'react';
import {
    Modal,
    Box,
    Grid,
    Button,
} from '@mui/material';
import { FiX } from "react-icons/fi";
import { useFormik } from 'formik';
import * as Yup from 'yup';
// import { useRegisterMutation } from '@/store/services/api';
import { RxCross2 } from "react-icons/rx";
import { toast } from 'react-toastify';
const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
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

// const validationSchema = Yup.object().shape({
//   account_type: Yup.string().required('Required'),
//   first_name: Yup.string().required('Required'),
//   last_name: Yup.string().required('Required'),
//   email: Yup.string().email('Invalid email').required('Required'),
//   phone_number: Yup.string().required('Required'),
//   password: Yup.string().required('Required'),
//   password_confirmation: Yup.string()
//     .oneOf([Yup.ref('password')], 'Passwords must match')
//     .required('Required'),
//   country: Yup.string().required('Required'),
//   address: Yup.string().required('Required'),
//   state: Yup.string(),
//   city: Yup.string().required('Required'),
//   zip_code: Yup.string().required('Required'),
//   status: Yup.string().required('Required'),
//   company: Yup.string().required('Required'),
//   communication_preference: Yup.string().required('Required'),
//   referredBy: Yup.string(),
//   notes: Yup.string(),
// });

const InventoryModal: React.FC<Props> = ({ open, onClose }) => {

    const [images, setImages] = useState([]);

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        const newImages = files.map((file) => ({
            url: URL.createObjectURL(file),
            file,
        }));
        setImages([...images, ...newImages]);
    };

    const removeImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
    };
    //   const [register] = useRegisterMutation();

    //   const formik = useFormik({
    //     initialValues: {
    //       account_type: '',
    //       first_name: '',
    //       last_name: '',
    //       email: '',
    //       phone_number: '',
    //       password: '',
    //       password_confirmation: '',
    //       country: '',
    //       address: '',
    //       state: '',
    //       city: '',
    //       zip_code: '',
    //       status: '',
    //       company: '',
    //       communication_preference: '',
    //       referredBy: '',
    //       notes: '',
    //     },
    //     validationSchema,
    //     onSubmit: async (values, { resetForm }) => {
    //       try {
    //         const response = await register(values).unwrap();
    //                 toast.success(response.message);
    //         resetForm();
    //         onClose();
    //       } catch (error) {
    //         toast.error('Registration failed:');
    //       }
    //     },
    //   });

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>

                <div className='flex justify-between items-center mb-3 border-b border-gray-400 pb-3'>
                    <p className='text-xl font-semibold'>Add New Inventory</p>

                    <RxCross2 onClick={onClose} className='cursor-pointer text-3xl' />

                </div>
                <form autoComplete='off'>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <label className='text-sm text-custom-lightGray'>
                                Category <span className='text-red-600'>*</span>
                                <select
                                    name="category"
                                    style={selectStyle}
                                //   value={formik.values.account_type}
                                //   onChange={formik.handleChange}
                                //   onBlur={formik.handleBlur}
                                >
                                    <option value="">Select</option>
                                    <option value="admin">Admin</option>
                                    <option value="Investor">Investor</option>
                                    <option value="Salesperson">Salesperson</option>
                                    <option value="Employee">Employee</option>
                                    <option value="Broker">Broker</option>
                                </select>
                            </label>
                            {/* {formik.touched.account_type && formik.errors.account_type && (
                <div style={{ color: 'red' }}>{formik.errors.account_type}</div>
              )} */}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <label className='text-sm text-custom-lightGray'>
                                SubCategory<span className='text-red-600'>*</span>
                                <select
                                    name="country"
                                    style={selectStyle}
                                //   value={formik.values.country}
                                //   onChange={formik.handleChange}
                                //   onBlur={formik.handleBlur}
                                >
                                    <option value="">Select</option>
                                    <option value="Pakistan">Pakistan</option>
                                    <option value="USA">USA</option>
                                </select>
                            </label>
                            {/* {formik.touched.country && formik.errors.country && (
                <div style={{ color: 'red' }}>{formik.errors.country}</div>
              )} */}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <label className='text-sm text-custom-lightGray'>
                                Year<span className='text-red-600'>*</span>
                                <input
                                    type="text"
                                    name="last_name"
                                    style={inputStyle}
                                //   value={formik.values.last_name}
                                //   onChange={formik.handleChange}
                                //   onBlur={formik.handleBlur}
                                />
                            </label>
                            {/* {formik.touched.last_name && formik.errors.last_name && (
                <div style={{ color: 'red' }}>{formik.errors.last_name}</div>
              )} */}
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <label className='text-sm text-custom-lightGray'>
                                Make<span className='text-red-600'>*</span>
                                <input
                                    type="text"
                                    name="make"
                                    style={inputStyle}
                                //   value={formik.values.last_name}
                                //   onChange={formik.handleChange}
                                //   onBlur={formik.handleBlur}
                                />
                            </label>

                            {/* {formik.touched.email && formik.errors.email && (
                <div style={{ color: 'red' }}>{formik.errors.email}</div>
              )} */}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <label className='text-sm text-custom-lightGray'>
                                Model <span className='text-red-600'>*</span>
                                <input
                                    type="text"
                                    name="model"
                                    style={inputStyle}
                                //   value={formik.values.phone_number}
                                //   onChange={formik.handleChange}
                                //   onBlur={formik.handleBlur}
                                />
                            </label>
                            {/* {formik.touched.phone_number && formik.errors.phone_number && (
                <div style={{ color: 'red' }}>{formik.errors.phone_number}</div>
              )} */}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <label className='text-sm text-custom-lightGray'>
                                Serial No. <span className='text-red-600'>*</span>
                                <input
                                    type="number"
                                    name="serial no"


                                    style={inputStyle}
                                //   value={formik.values.password}
                                //   onChange={formik.handleChange}
                                //   onBlur={formik.handleBlur}
                                />
                            </label>
                            {/* {formik.touched.password && formik.errors.password && (
                <div style={{ color: 'red' }}>{formik.errors.password}</div>
              )} */}
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <label className='text-sm text-custom-lightGray'>
                                Length<span className='text-red-600'>*</span>
                                <input
                                    type="number"
                                    name="length"
                                    style={inputStyle}
                                //   value={formik.values.password_confirmation}
                                //   onChange={formik.handleChange}
                                //   onBlur={formik.handleBlur}
                                />
                            </label>
                            {/* {formik.touched.password_confirmation &&
                formik.errors.password_confirmation && (
                  <div style={{ color: 'red' }}>
                    {formik.errors.password_confirmation}
                  </div>
                )} */}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <label className='text-sm text-custom-lightGray'>
                                Height<span className='text-red-600'>*</span>
                                <input
                                    type="number"
                                    name="height"
                                    style={inputStyle}
                                //   value={formik.values.password_confirmation}
                                //   onChange={formik.handleChange}
                                //   onBlur={formik.handleBlur}
                                />
                            </label>
                            {/* {formik.touched.password_confirmation &&
                formik.errors.password_confirmation && (
                  <div style={{ color: 'red' }}>
                    {formik.errors.password_confirmation}
                  </div>
                )} */}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <label className='text-sm text-custom-lightGray'>
                                Width <span className='text-red-600'>*</span>
                                <input
                                    type="number"
                                    name="width"
                                    style={inputStyle}
                                //   value={formik.values.address}
                                //   onChange={formik.handleChange}
                                //   onBlur={formik.handleBlur}
                                />
                            </label>
                            {/* {formik.touched.address && formik.errors.address && (
                <div style={{ color: 'red' }}>{formik.errors.address}</div>
              )} */}
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <label className='text-sm text-custom-lightGray'>
                                Width<span className='text-red-600 '>*</span>
                                <input
                                    type="number"
                                    name="width"
                                    style={inputStyle}
                                //   value={formik.values.password_confirmation}
                                //   onChange={formik.handleChange}
                                //   onBlur={formik.handleBlur}
                                />
                            </label>
                            {/* {formik.touched.password_confirmation &&
                formik.errors.password_confirmation && (
                  <div style={{ color: 'red' }}>
                    {formik.errors.password_confirmation}
                  </div>
                )} */}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <label className='text-sm text-custom-lightGray'>
                                Hours <span className='text-red-600'>*</span>
                                <input
                                    type="number"
                                    name="hours"
                                    style={inputStyle}
                                //   value={formik.values.city}
                                //   onChange={formik.handleChange}
                                //   onBlur={formik.handleBlur}
                                />
                            </label>
                            {/* {formik.touched.city && formik.errors.city && (
                <div style={{ color: 'red' }}>{formik.errors.city}</div>
              )} */}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <label className='text-sm text-custom-lightGray'>
                                Data Purchased <span className='text-red-600'>*</span>
                                <input
                                    type="text"
                                    name="data purchased"
                                    style={inputStyle}
                                //   value={formik.values.zip_code}
                                //   onChange={formik.handleChange}
                                //   onBlur={formik.handleBlur}
                                />
                            </label>
                            {/* {formik.touched.zip_code && formik.errors.zip_code && (
                <div style={{ color: 'red' }}>{formik.errors.zip_code}</div>
              )} */}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <label className='text-sm text-custom-lightGray'>
                                Price Paid<span className='text-red-600'>*</span>
                                <input
                                    type="number"
                                    name="price paid"
                                    style={inputStyle}
                                //   value={formik.values.password_confirmation}
                                //   onChange={formik.handleChange}
                                //   onBlur={formik.handleBlur}
                                />
                            </label>
                            {/* {formik.touched.password_confirmation &&
                formik.errors.password_confirmation && (
                  <div style={{ color: 'red' }}>
                    {formik.errors.password_confirmation}
                  </div>
                )} */}
                        </Grid>

                        <Grid xs={12} md={12} mt={2} ml={2}>
                            <div>
                                <h1 className='text-sm text-black'>Attach Files</h1>
                                <p className='text-custom-lightGray text-sm'>Only PDF, JPG & PNG formats are allowed</p>
                            </div>
                          <div className='flex items-center gap-2 mt-3'>
                          <label
                                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer h-[103px] px-2 hover:bg-gray-100"
                            >
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
                                        <div key={index} className="relative w-30 h-26">
                                            <img
                                                src={img.url}
                                                alt={`Uploaded preview ${index}`}
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                            <button
                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                                onClick={() => removeImage(index)}
                                            >
                                                <FiX size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                          </div>
                        </Grid>





                        {/* Notes */}


                        {/* Buttons */}
                        <Grid item xs={12} display="flex" justifyContent="flex-end" mt={2}>
                            <Button onClick={onClose} variant="outlined" sx={{ mr: 2, textTransform: 'none' }}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ backgroundColor: '#C28024', '&:hover': { backgroundColor: '#a56a1d' }, textTransform: 'none' }}
                            >
                                Add User
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};

export default InventoryModal;
