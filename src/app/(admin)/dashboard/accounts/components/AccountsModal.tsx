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
  accountType: Yup.string().required('Required'),
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  phone: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Required'),
  country: Yup.string().required('Required'),
  address: Yup.string().required('Required'),
  state: Yup.string(),
  city: Yup.string().required('Required'),
  zipCode: Yup.string().required('Required'),
  status: Yup.string().required('Required'),
  company: Yup.string().required('Required'),
  communicationPreferences: Yup.string().required('Required'),
  referredBy: Yup.string(),
  notes: Yup.string(),
});

const AccountsModal: React.FC<Props> = ({ open, onClose }) => {
  const [register] = useRegisterMutation();

  const formik = useFormik({
    initialValues: {
      accountType: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      country: '',
      address: '',
      state: '',
      city: '',
      zipCode: '',
      status: '',
      company: '',
      communicationPreferences: '',
      referredBy: '',
      notes: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await register(values).unwrap();
        console.log('Registration successful:', response);
        resetForm();
        onClose();
      } catch (error) {
        console.error('Registration failed:', error);
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
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
            <label className='text-sm'>
            Account Type <span className='text-red-600'>*</span>
                <select
                  name="accountType"
                  style={selectStyle}
                  value={formik.values.accountType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Select</option>
                  <option value="Investor">Investor</option>
                  <option value="Salesperson">Salesperson</option>
                </select>
              </label>
              {formik.touched.accountType && formik.errors.accountType && (
                <div style={{ color: 'red' }}>{formik.errors.accountType}</div>
              )}
            </Grid>
            <Grid item xs={12} md={4}>
            <label className='text-sm'>
            First Name <span className='text-red-600'>*</span>
                <input
                  type="text"
                  name="firstName"
                  style={inputStyle}
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </label>
              {formik.touched.firstName && formik.errors.firstName && (
                <div style={{ color: 'red' }}>{formik.errors.firstName}</div>
              )}
            </Grid>
            <Grid item xs={12} md={4}>
            <label className='text-sm'>
            Last Name <span className='text-red-600'>*</span>
                <input
                  type="text"
                  name="lastName"
                  style={inputStyle}
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </label>
              {formik.touched.lastName && formik.errors.lastName && (
                <div style={{ color: 'red' }}>{formik.errors.lastName}</div>
              )}
            </Grid>

            <Grid item xs={12} md={3}>
              <label className='text-sm'>
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
              {formik.touched.email && formik.errors.email && (
                <div style={{ color: 'red' }}>{formik.errors.email}</div>
              )}
            </Grid>
            <Grid item xs={12} md={3}>
            <label className='text-sm'>
            Phone <span className='text-red-600'>*</span>
                <input
                  type="text"
                  name="phone"
                  style={inputStyle}
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </label>
              {formik.touched.phone && formik.errors.phone && (
                <div style={{ color: 'red' }}>{formik.errors.phone}</div>
              )}
            </Grid>
            <Grid item xs={12} md={3}>
            <label className='text-sm'>
            Password <span className='text-red-600'>*</span>
                <input
                  type="password"
                  name="password"
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
            Confirm Password <span className='text-red-600'>*</span>
                <input
                  type="password"
                  name="confirmPassword"
                  style={inputStyle}
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </label>
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <div style={{ color: 'red' }}>
                    {formik.errors.confirmPassword}
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
                  <option value="Pakistan">Pakistan</option>
                  <option value="USA">USA</option>
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
            State/Region <span className='text-red-600'>*</span>
                <select
                  name="state"
                  style={selectStyle}
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Select</option>
                  <option value="Region1">Region 1</option>
                  <option value="Region2">Region 2</option>
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
                  name="zipCode"
                  style={inputStyle}
                  value={formik.values.zipCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </label>
              {formik.touched.zipCode && formik.errors.zipCode && (
                <div style={{ color: 'red' }}>{formik.errors.zipCode}</div>
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
                  name="communicationPreferences"
                  style={selectStyle}
                  value={formik.values.communicationPreferences}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Select</option>
                  <option value="Email">Email</option>
                  <option value="Phone">Phone</option>
                </select>
              </label>
              {formik.touched.communicationPreferences &&
                formik.errors.communicationPreferences && (
                  <div style={{ color: 'red' }}>
                    {formik.errors.communicationPreferences}
                  </div>
                )}
            </Grid>

            <Grid item xs={12} md={4}>
            <label className='text-sm'>
            Referred By <span className='text-red-600'>*</span>
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
            Notes <span className='text-red-600'>*</span>
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
              <Button onClick={onClose} variant="outlined" sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{ backgroundColor: '#C28024', '&:hover': { backgroundColor: '#a56a1d' } }}
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
