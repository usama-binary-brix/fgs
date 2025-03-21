'use client';
import React from 'react';
import {
  Modal,
  Box,
  Grid,
  Button,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRegisterMutation } from '@/store/services/api';
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

const validationSchema = Yup.object().shape({
  account_type: Yup.string().required('Required'),
  first_name: Yup.string()
  .max(15, 'Must be 15 characters or less')
  .required('Required'),

last_name: Yup.string()
  .max(15, 'Must be 15 characters or less'),
  // last_name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  phone_number: Yup.string()
  .matches(/^[0-9]+$/, 'Only numbers are allowed')
  .required('Required'),
  // phone_number: Yup.string().required('Required'),
  // password: Yup.string().required('Required'),
  // password_confirmation: Yup.string()
  //   .oneOf([Yup.ref('password')], 'Passwords must match')
  //   .required('Required'),
  country: Yup.string().required('Required'),
  address: Yup.string().required('Required'),
  state: Yup.string(),
  city: Yup.string().required('Required'),
  zip_code: Yup.string().required('Required'),
  status: Yup.string().required('Required'),
  company: Yup.string().required('Required'),
  communication_preference: Yup.string().required('Required'),
  referredBy: Yup.string(),
  notes: Yup.string(),
});

const AccountsModal: React.FC<Props> = ({ open, onClose }) => {
  const [register] = useRegisterMutation();

  const formik = useFormik({
    initialValues: {
      account_type: '',
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      password: '',
      password_confirmation: '',
      country: '',
      address: '',
      state: '',
      city: '',
      zip_code: '',
      status: '',
      company: '',
      communication_preference: '',
      referredBy: '',
      notes: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await register(values).unwrap();
                toast.success(response.message);
        resetForm();
        onClose();
      } catch (error) {
        toast.error('Registration failed');
        console.log(error, 'error registration ')
      }
    },
  });

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>

<div className='flex justify-between items-center mb-3 border-b border-gray-400 pb-3'>
<p className='text-xl font-semibold'>Add New Account</p>

<RxCross2 onClick={onClose} className='cursor-pointer text-3xl'/>

</div>
        <form onSubmit={formik.handleSubmit} autoComplete='off'>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
            <label className='text-sm'>
            Account Type <span className='text-red-600'>*</span>
                <select
                  name="account_type"
                  style={selectStyle}
                  value={formik.values.account_type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Select</option>
                  <option value="admin">Admin</option>
                  <option value="Investor">Investor</option>
                  <option value="Salesperson">Salesperson</option>
                  <option value="Employee">Employee</option>
                  <option value="Broker">Broker</option>
                </select>
              </label>
              {formik.touched.account_type && formik.errors.account_type && (
                <div style={{ color: 'red' }}>{formik.errors.account_type}</div>
              )}
            </Grid>
            <Grid item xs={12} md={4}>
            <label className='text-sm'>
            First Name <span className='text-red-600'>*</span>
                <input
                  type="text"
                  name="first_name"
                  style={inputStyle}
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  maxLength={15}
                />
              </label>
              {formik.touched.first_name && formik.errors.first_name && (
                <div style={{ color: 'red' }}>{formik.errors.first_name}</div>
              )}
            </Grid>
            <Grid item xs={12} md={4}>
            <label className='text-sm'>
            Last Name
                <input
                  type="text"
                  name="last_name"
                  style={inputStyle}
                  value={formik.values.last_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  maxLength={15}

                />
              </label>
              {formik.touched.last_name && formik.errors.last_name && (
                <div style={{ color: 'red' }}>{formik.errors.last_name}</div>
              )}
            </Grid>

            <Grid item xs={12} md={3}>
              <label className='text-sm'>
                Email <span className='text-red-600'>*</span>
                <input
                  type="email"
                  name="email"
                  autoComplete='off'
                  style={inputStyle}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </label>
              {formik.touched.email && formik.errors.email && (
                <div style={{ color: 'red' }}>{formik.errors.email}</div>
              )}
            </Grid>
            <Grid item xs={12} md={3}>
            <label className='text-sm'>
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
              {formik.touched.phone_number && formik.errors.phone_number && (
                <div style={{ color: 'red' }}>{formik.errors.phone_number}</div>
              )}
            </Grid>
            <Grid item xs={12} md={3}>
            <label className='text-sm'>
            Password
                <input
                  type="password"
                  name="password"
                  autoComplete='off'
              
                  style={inputStyle}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </label>
              {formik.touched.password && formik.errors.password && (
                <div style={{ color: 'red' }}>{formik.errors.password}</div>
              )}
            </Grid>

            <Grid item xs={12} md={3}>
            <label className='text-sm'>
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
              {formik.touched.password_confirmation &&
                formik.errors.password_confirmation && (
                  <div style={{ color: 'red' }}>
                    {formik.errors.password_confirmation}
                  </div>
                )}
            </Grid>
            <Grid item xs={12} md={4}>
            <label className='text-sm'>
            Country<span className='text-red-600'>*</span>
                <select
                  name="country"
                  style={selectStyle}
                  value={formik.values.country}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Select</option>
                  <option value="USA">USA</option>
                  {/* <option value="canada">Canada</option> */}
                </select>
              </label>
              {formik.touched.country && formik.errors.country && (
                <div style={{ color: 'red' }}>{formik.errors.country}</div>
              )}
            </Grid>
            <Grid item xs={12} md={4}>
            <label className='text-sm'>
            Address <span className='text-red-600'>*</span>
                <input
                  type="text"
                  name="address"
                  style={inputStyle}
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </label>
              {formik.touched.address && formik.errors.address && (
                <div style={{ color: 'red' }}>{formik.errors.address}</div>
              )}
            </Grid>

            <Grid item xs={12} md={4}>
            <label className='text-sm'>
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
            <label className='text-sm'>
            City <span className='text-red-600'>*</span>
                <input
                  type="text"
                  name="city"
                  style={inputStyle}
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </label>
              {formik.touched.city && formik.errors.city && (
                <div style={{ color: 'red' }}>{formik.errors.city}</div>
              )}
            </Grid>
            <Grid item xs={12} md={4}>
            <label className='text-sm'>
            Zip/Postal Code <span className='text-red-600'>*</span>
                <input
                  type="text"
                  name="zip_code"
                  style={inputStyle}
                  value={formik.values.zip_code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </label>
              {formik.touched.zip_code && formik.errors.zip_code && (
                <div style={{ color: 'red' }}>{formik.errors.zip_code}</div>
              )}
            </Grid>

            <Grid item xs={12} md={4}>
            <label className='text-sm'>
            Status <span className='text-red-600'>*</span>
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
              {formik.touched.status && formik.errors.status && (
                <div style={{ color: 'red' }}>{formik.errors.status}</div>
              )}
            </Grid>
            <Grid item xs={12} md={4}>
            <label className='text-sm'>
            Company <span className='text-red-600'>*</span>
                <input
                  type="text"
                  name="company"
                  style={inputStyle}
                  value={formik.values.company}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </label>
              {formik.touched.company && formik.errors.company && (
                <div style={{ color: 'red' }}>{formik.errors.company}</div>
              )}
            </Grid>
            <Grid item xs={12} md={4}>
            <label className='text-sm'>
            Communication Preferences <span className='text-red-600'>*</span>
                <select
                  name="communication_preference"
                  style={selectStyle}
                  value={formik.values.communication_preference}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Select</option>
                  <option value="Email">Email</option>
                  <option value="Phone">Phone</option>
                </select>
              </label>
              {formik.touched.communication_preference &&
                formik.errors.communication_preference && (
                  <div style={{ color: 'red' }}>
                    {formik.errors.communication_preference}
                  </div>
                )}
            </Grid>

            <Grid item xs={12} md={4}>
            <label className='text-sm'>
            Referred By 
                <input
                  type="text"
                  name="referredBy"
                  style={inputStyle}
                  value={formik.values.referredBy}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </label>
            </Grid>

            {/* Notes */}
            <Grid item xs={12}>
            <label className='text-sm'>
            Notes 
                <textarea
                  name="notes"
                  style={{ ...inputStyle, resize: 'vertical' }}
                  rows={3}
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                ></textarea>
              </label>
            </Grid>

            {/* Buttons */}
            <Grid item xs={12} display="flex" justifyContent="flex-end" mt={2}>
              <Button onClick={onClose} variant="outlined" sx={{ mr: 2, textTransform:'none' }}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{ backgroundColor: '#C28024', '&:hover': { backgroundColor: '#a56a1d' }, textTransform:'none' }}
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

export default AccountsModal;
