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
import { optionalPasswordValidationSchema, optionalConfirmPasswordValidationSchema } from '@/lib/validation';
import PasswordStrengthIndicator from '@/components/form/PasswordStrengthIndicator';
export const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -45%)',
  width: '70%',
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  paddingY: '10px',
  overflowY: 'auto',
  borderRadius: 2,
};


export const modalStyles = {
  base: "absolute pb-5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl rounded-lg overflow-y-auto",
  sizes: {
    default: "w-[85%] sm:w-[80%] md:w-[80%] lg:w-[70%] max-h-[80vh] md:max-h-[90vh]",
    small: "w-[70%] sm:w-[60%] md:w-[70%] lg:w-[60%] max-h-[70vh]",
    large: "w-[78%] sm:w-[65%] md:w-[90%] lg:w-[85%] max-h-[90vh]"
  },
  header: "sticky top-0 z-10 bg-white border-b border-gray-400 py-3 px-4",
  content: "px-4 py-4 overflow-y-auto",
  title: "text-lg sm:text-xl font-semibold",
  closeButton: "cursor-pointer text-2xl sm:text-3xl text-gray-600 hover:text-gray-900"
} as const;


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
  // const stateOptions = [
  //   { value: 'NY', label: 'New York' },
  //   { value: 'AL', label: 'Alabama' },

  // ]
  const stateOptions = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

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
      .test('min-digits', 'Phone number must have at least 8 digits', function(value) {
        if (!value) return true; // Let required validation handle empty values
        const digitCount = (value.match(/\d/g) || []).length;
        return digitCount >= 8;
      })
      .max(18, 'Phone number must be at most 18 characters')
      .required('Required'),
      password: optionalPasswordValidationSchema,
      password_confirmation: optionalConfirmPasswordValidationSchema,
      country: Yup.string(),
      address: Yup.string(),
      region: Yup.string(),
      city: Yup.string(),
      zip_code: Yup.string(),
      status: Yup.string(),
      company_name: Yup.string(),
      communication_preference: Yup.string(),
      reffer_by: Yup.string()
        .matches(/^[a-zA-Z\s]+$/, "Referred by can only contain letters and spaces")
        .min(2, "Referred by must be at least 2 characters")
        .max(50, "Referred by must be less than 50 characters"),
      note: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (values.password && !values.password_confirmation) {
        toast.error('Confirm password is required.');
        return;
      }
      if (values.password_confirmation && !values.password) {
        toast.error('Password is required.');
        return;
      }
      if (values.password && values.password_confirmation && values.password !== values.password_confirmation) {
        toast.error('Passwords do not match.');
        return;
      }
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

  // Custom handler for reffer_by field to only allow letters and spaces
  const handleRefferByChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow letters and spaces
    const filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
    formik.setFieldValue('reffer_by', filteredValue);
  };

  // Custom handler for phone_number field to only allow numbers, +, and spaces
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers, +, and spaces
    const filteredValue = value.replace(/[^\d\s+]/g, '');
    formik.setFieldValue('phone_number', filteredValue);
  };

  return (
    <Modal open={open} onClose={onClose}>
       <Box className={`${modalStyles.base} ${modalStyles.sizes.default}`}>
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
                  autoComplete="new-email"
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
                  name="phone_number"
                  value={formik.values.phone_number}
                  onChange={handlePhoneNumberChange}
                  onBlur={formik.handleBlur}
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
                    autoComplete="new-password"
                    maxLength={16}
                    {...formik.getFieldProps("password")}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-2 top-1/2"
                  >
                    {showPassword ? <EyeIcon className="fill-gray-500 dark:fill-gray-400" /> : <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />}
                  </span>
                </div>
                {formik.values.password && (
                  <PasswordStrengthIndicator password={formik.values.password} />
                )}
                {formik.touched.password && formik.errors.password && (
                  <p className="text-error-500 text-sm">{String(formik.errors.password)}</p>
                )}
              </div>

            </Grid>
            <Grid item xs={12} md={3}>
              <div>
                <Label>Confirm Password</Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Enter confirm password"
                    autoComplete="new-password"
                    maxLength={16}
                    {...formik.getFieldProps("password_confirmation")}
                  />
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-2 top-1/2"
                  >
                    {showConfirmPassword ? <EyeIcon className="fill-gray-500 dark:fill-gray-400" /> : <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />}
                  </span>
                </div>
                {formik.touched.password_confirmation && formik.errors.password_confirmation && (
                  <p className="text-error-500 text-sm">{String(formik.errors.password_confirmation)}</p>
                )}
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
                  placeholder="Enter Referred By"
                  type="text"
                  name="reffer_by"
                  value={formik.values.reffer_by}
                  onChange={handleRefferByChange}
                  onBlur={formik.handleBlur}
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
                  {loading ? <div className=" flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
          </div>  : userData ? 'Update Account' : 'Add Account'}
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
