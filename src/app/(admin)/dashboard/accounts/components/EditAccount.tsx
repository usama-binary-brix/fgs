'use client';
import React, { useEffect, useState } from 'react';
import { Modal, Box, Grid, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRegisterMutation } from '@/store/services/api';
import { RxCross2 } from 'react-icons/rx';
import { toast } from 'react-toastify';

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '75%',
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
  userData: any; 
}

const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    // marginTop: '8px',
  };
  
  const selectStyle = {
    ...inputStyle,
  };

const EditAccount: React.FC<Props> = ({ open, onClose, userData }) => {
  const [register] = useRegisterMutation();
  const [loading, setLoading] = useState(false)
const getInitialValues = (userData:any) => ({
  account_type: userData?.account_type || '',
  first_name: userData?.first_name || '',
  last_name: userData?.last_name || '',
  email: userData?.email || '',
  phone_number: userData?.phone_number || '',
  password: '',
  password_confirmation: '',
  country: userData?.country || '',
  address: userData?.address || '',
  state: userData?.region || '',
  city: userData?.city || '',
  zip_code: userData?.zip_code || '',
  status:
    userData?.status?.toLowerCase() === 'active'
      ? '1'
      : userData?.status?.toLowerCase() === 'inactive'
      ? '0'
      : '', 
  company_name: userData?.company_name || '',
  communication_preference: userData?.communication_preference?.toLowerCase() || '',
  referredBy: userData?.referred_by || '',
  note: userData?.note || '',
});


const formik = useFormik({
  initialValues: getInitialValues(userData),
  validationSchema: Yup.object().shape({
    account_type: Yup.string().required('Required'),
    first_name: Yup.string().required('Required'),
    last_name: Yup.string(),
    email: Yup.string().email('Invalid email').required('Required'),
    phone_number: Yup.string().required('Required'),
    country: Yup.string(),
    address: Yup.string(),
    city: Yup.string(),
    zip_code: Yup.string(),
    status: Yup.string(),
    company_name: Yup.string(),
    communication_preference: Yup.string(),
  }),
  onSubmit: async (values, { resetForm }) => {
    setLoading(true)
    try {
      if (!userData?.id) {
        setLoading(false)
        toast.error('Invalid user data. Cannot update.');
        return;
      }

      const payload = { id: userData.id, ...values };
      const response = await register(payload).unwrap();

      toast.success(response.message || 'Account updated successfully');
setLoading(false)
      resetForm();
      onClose();
    } catch (error) {
      toast.error('Please try again.');
setLoading(false)

    }
  },
  enableReinitialize: false,
});

useEffect(() => {
  if (userData) {
    formik.setValues(getInitialValues(userData));
  }
}, [userData]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <div className="flex justify-between items-center mb-3 border-b border-gray-400 pb-3">
          <p className="text-xl font-semibold">Edit Account</p>
          <RxCross2 onClick={onClose} className="cursor-pointer text-3xl" />
        </div>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            {/* Account Type */}
            <Grid item xs={12} md={4}>
              <label className="text-sm text-gray-500">
                Account Type <span className="text-red-600">*</span>
                <select
                  name="account_type"
                  value={formik.values.account_type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select</option>
                  <option value="admin">Admin</option>
                  <option value="Investor">Investor</option>
                  <option value="Salesperson">Salesperson</option>
                </select>
              </label>
              {/* {formik.touched.account_type && formik.errors.account_type && (
                <div className="text-red-600">{formik.errors.account_type}</div>
              )} */}
            </Grid>

            {/* First Name */}
            <Grid item xs={12} md={4}>
              <label className="text-sm text-gray-500">
                First Name <span className="text-red-600">*</span>
                <input
                  type="text"
                  name="first_name"
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full p-2 border rounded"
                />
              </label>
              {/* {formik.touched.first_name && formik.errors.first_name && (
                <div className="text-red-600">{formik.errors.first_name}</div>
              )} */}
            </Grid>

            {/* Last Name */}
            <Grid item xs={12} md={4}>
              <label className="text-sm text-gray-500">
                Last Name 
                <input
                  type="text"
                  name="last_name"
                  value={formik.values.last_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full p-2 border rounded"
                />
              </label>
              {/* {formik.touched.last_name && formik.errors.last_name && (
                <div className="text-red-600">{formik.errors.last_name}</div>
              )} */}
            </Grid>

           
                       <Grid item xs={12} md={3}>
                         <label className='text-sm text-gray-500'>
                           Email <span className='text-red-600'>*</span>
                           <input
                             type="email"
                             name="email"
                             style={inputStyle}
                             value={formik.values.email}
                             onChange={formik.handleChange}
                             onBlur={formik.handleBlur}
                           />
                         </label>
                         {/* {formik.touched.email && formik.errors.email && (
                           <div style={{ color: 'red' }}>{formik.errors.email}</div>
                         )} */}
                       </Grid>
                       <Grid item xs={12} md={3}>
                       <label className='text-sm text-gray-500'>
                       Phone <span className='text-red-600'>*</span>
                           <input
                             type="text"
                             name="phone_number"
                             style={inputStyle}
                             
                             value={formik.values.phone_number}
                             onChange={formik.handleChange}
                             onBlur={formik.handleBlur}
                           />
                         </label>
                         {/* {formik.touched.phone_number && formik.errors.phone_number && (
                           <div style={{ color: 'red' }}>{formik.errors.phone_number}</div>
                         )} */}
                       </Grid>
                       <Grid item xs={12} md={3}>
                       <label className='text-sm text-gray-500'>
                       Password 
                           <input
                             type="password"
                             name="password"
                             style={inputStyle}
                             
                             value={formik.values.password}
                             onChange={formik.handleChange}
                             onBlur={formik.handleBlur}
                           />
                         </label>
                         {/* {formik.touched.password && formik.errors.password && (
                           <div style={{ color: 'red' }}>{formik.errors.password}</div>
                         )} */}
                       </Grid>
           
                       <Grid item xs={12} md={3}>
                       <label className='text-sm text-gray-500'>
                       Confirm Password 
                           <input
                             type="password"
                             name="password_confirmation"
                             style={inputStyle}
                             
                             value={formik.values.password_confirmation}
                             onChange={formik.handleChange}
                             onBlur={formik.handleBlur}
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
                       <label className='text-sm text-gray-500'>
                       Country
                           <select
                             name="country"
                             style={selectStyle}
                             value={formik.values.country}
                             onChange={formik.handleChange}
                             onBlur={formik.handleBlur}
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
                       <label className='text-sm text-gray-500'>
                       Address 
                           <input
                             type="text"
                             name="address"
                             style={inputStyle}
                             
                             value={formik.values.address}
                             onChange={formik.handleChange}
                             onBlur={formik.handleBlur}
                           />
                         </label>
                         {/* {formik.touched.address && formik.errors.address && (
                           <div style={{ color: 'red' }}>{formik.errors.address}</div>
                         )} */}
                       </Grid>
           
                       <Grid item xs={12} md={4}>
                       <label className='text-sm text-gray-500'>
                       State/Region 
                           <select
                             name="state"
                             style={selectStyle}
                             value={formik.values.state}
                             onChange={formik.handleChange}
                             onBlur={formik.handleBlur}
                           >
                             <option value="">Select</option>
                             <option value="NY">New York</option>
                             <option value="AL">Alabama</option>
                           </select>
                         </label>
                       </Grid>
                       <Grid item xs={12} md={4}>
                       <label className='text-sm text-gray-500'>
                       City 
                           <input
                             type="text"
                             name="city"
                             style={inputStyle}
                             
                             value={formik.values.city}
                             onChange={formik.handleChange}
                             onBlur={formik.handleBlur}
                           />
                         </label>
                         {/* {formik.touched.city && formik.errors.city && (
                           <div style={{ color: 'red' }}>{formik.errors.city}</div>
                         )} */}
                       </Grid>
                       <Grid item xs={12} md={4}>
                       <label className='text-sm text-gray-500'>
                       Zip/Postal Code 
                           <input
                             type="text"
                             name="zip_code"
                             style={inputStyle}
                             
                             value={formik.values.zip_code}
                             onChange={formik.handleChange}
                             onBlur={formik.handleBlur}
                           />
                         </label>
                         {/* {formik.touched.zip_code && formik.errors.zip_code && (
                           <div style={{ color: 'red' }}>{formik.errors.zip_code}</div>
                         )} */}
                       </Grid>
           
                       <Grid item xs={12} md={4}>
                       <label className='text-sm text-gray-500'>
                       Status 
                           <select
                             name="status"
                             style={selectStyle}

                             value={formik.values.status}
                             onChange={formik.handleChange}
                             onBlur={formik.handleBlur}
                           >
                             <option value="">Select</option>
                             <option value="1">Active</option>
                             <option value="0">Inactive</option>
                           </select>
                         </label>
                         {/* {formik.touched.status && formik.errors.status && (
                           <div style={{ color: 'red' }}>{formik.errors.status}</div>
                         )} */}
                       </Grid>
                       <Grid item xs={12} md={4}>
                       <label className='text-sm text-gray-500'>
                       Company 
                           <input
                             type="text"
                             name="company_name"
                             style={inputStyle}
                             
                             value={formik.values.company_name}
                             onChange={formik.handleChange}
                             onBlur={formik.handleBlur}
                           />
                         </label>
                         {/* {formik.touched.company && formik.errors.company && (
                           <div style={{ color: 'red' }}>{formik.errors.company}</div>
                         )} */}
                       </Grid>
                       <Grid item xs={12} md={4}>
                       <label className='text-sm text-gray-500'>
                       Communication Preferences
                           <select
                             name="communication_preference"
                             style={selectStyle}
                         
                             value={formik.values.communication_preference}
                             onChange={formik.handleChange}
                             onBlur={formik.handleBlur}
                           >
                             <option value="">Select</option>
                             <option value="email">Email</option>
                             <option value="phone">Phone</option>
                           </select>
                         </label>
                         {/* {formik.touched.communication_preference &&
                           formik.errors.communication_preference && (
                             <div style={{ color: 'red' }}>
                               {formik.errors.communication_preference}
                             </div>
                           )} */}
                       </Grid>
           
                       <Grid item xs={12} md={4}>
                       <label className='text-sm text-gray-500'>
                       Referred By 
                           <input
                             type="text"
                             name="referredBy"
                             style={selectStyle}
                             
                             value={formik.values.referredBy}
                             onChange={formik.handleChange}
                             onBlur={formik.handleBlur}
                           />
                         </label>
                       </Grid>
           
                       {/* Notes */}
                       <Grid item xs={12}>
                       <label className='text-sm text-gray-500'>
                       Notes 

                     
                           <textarea
                             name="note"
                            //  style={{ resize: 'vertical' }}
                             rows={3}
                             style={inputStyle}

                             value={formik.values.note}
                             onChange={formik.handleChange}
                             onBlur={formik.handleBlur}
                           ></textarea>
                         </label>
                       </Grid>





            {/* Submit Button */}
            <Grid item xs={12} className="text-right">

            <Button onClick={onClose} variant="outlined"
                           sx={{
                            backgroundColor: '#8080801A',
                            mr: 2,
                            color: '#808080',
                            borderColor: '#8080801A', 
                            outline: 'none',
                            '&:hover': { 
                              backgroundColor: '#8080801B', 
                              borderColor: '#8080801A' 
                            },
                            textTransform: 'none',
                          }}
                        >
                          Close
                        </Button>

              <Button
               type="submit"
               variant="contained"
               sx={{ backgroundColor: '#C28024', '&:hover': { backgroundColor: '#a56a1d' }, textTransform:'none' }}
              >
              {loading ? 'Loading...' : 'Update Details'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default EditAccount;
