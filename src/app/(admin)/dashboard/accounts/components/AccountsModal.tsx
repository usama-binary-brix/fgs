'use client';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Grid,

} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRegisterMutation } from '@/store/services/api';
import { RxCross2 } from "react-icons/rx";
import { toast } from 'react-toastify';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import { EyeCloseIcon, EyeIcon } from '@/icons';
import TextArea from '@/components/form/input/TextArea';
import Button from '@/components/ui/button/Button';
export const modalStyle = {
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
  userData?: any;
}

export type ErrorResponse = {
  data: {
    error: Record<string, string>;
  };
};


const AccountsModal: React.FC<Props> = ({ open, onClose, userData }) => {
  const [register] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!open && !userData) {
      formik.resetForm();
    }
  }, [open, userData]);

  const options = [
    { value: "admin", label: "Admin" },
    { value: "investor", label: "Investor" },
    { value: "salesperson", label: "Sales Person" },
    { value: "employee", label: "Employee" },
    { value: "broker", label: "Broker" },
  ];

  const countryOptions = [
    { value: 'USA', label: 'USA' }
  ]
  const stateOptions = [
    { value: 'NY', label: 'New York' },
    { value: 'AL', label: 'Alabama' },

  ]
  const statusOptions = [
    { value: '1', label: 'Active' },
    { value: '0', label: 'InActive' },

  ]
  const communicationOptions = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },

  ]
  const getInitialValues = (userData: any) => ({
    account_type: userData?.account_type || '',
    first_name: userData?.first_name || '',
    last_name: userData?.last_name || '',
    email: userData?.email || '',
    phone_number: userData?.phone_number || '',
    password: '',
    password_confirmation: '',
    country: userData?.country || '',
    address: userData?.address || '',
    region: userData?.region || '',
    city: userData?.city || '',
    zip_code: userData?.zip_code || '',
    status: userData?.status ? (userData?.status == 'Active' ? '1' : '0') : '1',
    company_name: userData?.company_name || '',
    communication_preference: userData?.communication_preference || '',
    reffer_by: userData?.reffer_by || '',
    note: userData?.note || '',
  });

  const formik = useFormik({
    initialValues: getInitialValues(userData),
    validationSchema: Yup.object().shape({
      account_type: Yup.string().required('Account Type is Required'),
      first_name: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Please Enter First Name'),

      last_name: Yup.string()
        .max(15, 'Must be 15 characters or less'),
      email: Yup.string().email('Invalid email').required('Required'),
      phone_number: Yup.string()
      .matches(/^[+\d\s]+$/, 'Only numbers, +, and spaces are allowed')
      .max(18, 'Phone number must be at least 15 digits')
      .required('Required'),
      country: Yup.string(),
      address: Yup.string(),
      region: Yup.string(),
      city: Yup.string(),
      zip_code: Yup.string(),
      status: Yup.string(),
      company_name: Yup.string(),
      communication_preference: Yup.string(),
      reffer_by: Yup.string(),
      note: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        let response;
        if (userData?.id) {

          response = await register({ id: userData.id, ...values }).unwrap();
        } else {

          response = await register(values).unwrap();
        }

        toast.success(response.message || 'Success');
        setLoading(false);
        resetForm();
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

        setLoading(false);
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
        <div className=' border-b border-gray-400 mb-3 py-3'>

          <div className='flex justify-between items-center px-4'>
            <p className='text-xl font-semibold'>{userData ? 'Edit Account' : 'Add New Account'}</p>

            <RxCross2 onClick={onClose} className='cursor-pointer text-3xl' />

          </div>
        </div>
        <form onSubmit={formik.handleSubmit} autoComplete='off' className='px-4'>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Label>Account Type <span className="text-error-500">*</span></Label>
              <Select
                name="account_type"
                value={formik.values.account_type}
                options={options}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.account_type ? formik.errors.account_type : undefined}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <div>
                <Label>
                  First Name <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="Enter First Name"
                  type="text"
                  {...formik.getFieldProps("first_name")}
                />
                {formik.touched.first_name && formik.errors.first_name && (
                  <p className="text-error-500 text-sm">{String(formik.errors.first_name)}</p>
                )}
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div>
                <Label>
                  Last Name
                </Label>
                <Input
                  placeholder="Enter Last Name"
                  type="text"
                  {...formik.getFieldProps("last_name")} // ✅ Now works properly with onBlur
                />
                {formik.touched.last_name && formik.errors.last_name && (
                  <p className="text-error-500 text-sm">{String(formik.errors.last_name)}</p>
                )}
              </div>
            </Grid>
            <Grid item xs={12} md={3}>
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="Enter Email"
                  type="email"
                  {...formik.getFieldProps("email")} // ✅ Now works properly with onBlur
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-error-500 text-sm">{String(formik.errors.email)}</p>
                )}

              </div>
            </Grid>
            <Grid item xs={12} md={3}>
              <div>
                <Label>
                  Phone <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="Enter Phone Number"
                  type="text"
                  {...formik.getFieldProps("phone_number")} // ✅ Now works properly with onBlur
                />
                {formik.touched.phone_number && formik.errors.phone_number && (
                  <p className="text-error-500 text-sm">{String(formik.errors.phone_number)}</p>
                )}
              </div>


            </Grid>
            <Grid item xs={12} md={3}>

              <div>
                <Label>Password</Label>
                <div className="relative">
                  <Input

                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    {...formik.getFieldProps("password")}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-2 top-1/2"
                  >
                    {showPassword ? <EyeIcon className="fill-gray-500 dark:fill-gray-400" /> : <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />}
                  </span>
                </div>

              </div>

            </Grid>
            <Grid item xs={12} md={3}>
              <div>
                <Label>Confirm Password</Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Enter confirm password"
                    {...formik.getFieldProps("password_confirmation")}
                  />
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-2 top-1/2"
                  >
                    {showConfirmPassword ? <EyeIcon className="fill-gray-500 dark:fill-gray-400" /> : <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />}
                  </span>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>

              <Label>Country</Label>
              <Select
                name="country"
                value={formik.values.country}
                options={countryOptions}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.country ? formik.errors.country : undefined}
              />

            </Grid>
            <Grid item xs={12} md={4}>
              <div>
                <Label>
                  Address
                </Label>
                <Input
                  placeholder="Enter Address"
                  type="text"
                  {...formik.getFieldProps("address")} // ✅ Now works properly with onBlur
                />
                {formik.touched.address && formik.errors.address && (
                  <p className="text-error-500 text-sm">{String(formik.errors.address)}</p>
                )}
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <Label>    State/Region</Label>
              <Select
                name="region"
                value={formik.values.region}
                options={stateOptions}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.region ? formik.errors.region : undefined}
              />

            </Grid>
            <Grid item xs={12} md={4}>
              <div>
                <Label>
                  City
                </Label>
                <Input
                  placeholder="Enter City"
                  type="text"
                  {...formik.getFieldProps("city")}
                />
                {formik.touched.city && formik.errors.city && (
                  <p className="text-error-500 text-sm">{String(formik.errors.city)}</p>
                )}
              </div>

            </Grid>
            <Grid item xs={12} md={4}>
              <div>
                <Label>
                  Zip/Postal Code
                </Label>
                <Input
                  placeholder="Enter ZipCode"
                  type="text"
                  {...formik.getFieldProps("zip_code")}
                />
                {formik.touched.zip_code && formik.errors.zip_code && (
                  <p className="text-error-500 text-sm">{String(formik.errors.zip_code)}</p>
                )}
              </div>


            </Grid>
            <Grid item xs={12} md={4}>

              <Label>Status</Label>
              <Select
                name="status"
                value={formik.values.status}
                options={statusOptions}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.status ? formik.errors.status : undefined}
              />

            </Grid>
            <Grid item xs={12} md={4}>
              <div>
                <Label>
                  Company
                </Label>
                <Input
                  placeholder="Enter Company"
                  type="text"
                  {...formik.getFieldProps("company_name")}
                />
                {formik.touched.company_name && formik.errors.company_name && (
                  <p className="text-error-500 text-sm">{String(formik.errors.company_name)}</p>
                )}
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <Label> Communication Preferences</Label>
              <Select
                name="communication_preference"
                value={formik.values.communication_preference}
                options={communicationOptions}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.communication_preference ? formik.errors.communication_preference : undefined}
              />


            </Grid>
            <Grid item xs={12} md={4}>
              <div>
                <Label>
                  Referred By
                </Label>
                <Input
                  placeholder="Enter Preferred By"
                  type="text"
                  {...formik.getFieldProps("reffer_by")}
                />
                {formik.touched.reffer_by && formik.errors.reffer_by && (
                  <p className="text-error-500 text-sm">{String(formik.errors.reffer_by)}</p>
                )}
              </div>


            </Grid>
            <Grid item xs={12}>
              <Label>Notes</Label>
              <TextArea
                placeholder="Enter your note"
                rows={3}
                value={formik.values.note}
                onChange={(value) => formik.setFieldValue("note", value)}
                onBlur={() => formik.setFieldTouched("note", true)}
                error={formik.touched.note && Boolean(formik.errors.note)}
                hint={formik.touched.note ? formik.errors.note : ""}
                disabled={formik.isSubmitting}
              />

            </Grid>
            <Grid item xs={12} display="flex" justifyContent="flex-end">
              <div className='flex items-center gap-4'>
                <Button onClick={onClose} variant="fgsoutline"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : userData ? 'Update Account' : 'Add Account'}
                </Button>
              </div>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default AccountsModal;
