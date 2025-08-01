"use client";

import AddLeadInput from "@/app/(admin)/dashboard/leads/components/input/AddLeadInput";
import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiCalendar } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import RadioButton from '@/app/(admin)/dashboard/leads/components/radiobutton/RadioButton';
import { useFormik } from "formik";
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import { IoMdArrowRoundBack } from "react-icons/io";
import LeadSelect from "@/components/form/LeadSelect";
import ButtonLoader from "@/components/ButtonLoader";
import NProgress from "nprogress";

type ErrorResponse = {
  data: {
    error: Record<string, string>;
  };
};

interface LeadFormProps {
  onSubmit: (values: any) => Promise<any>;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  role: 'admin' | 'salesperson' | 'employee';
  className?: string;
  redirectPath?: string;
  mode?: 'create' | 'edit';
  initialData?: any;
  onPromoteToInvestor?: (leadId: string) => Promise<any>;
  leadId?: string;
  isPromoteLoading?: boolean;
  canPromote?: boolean;
}

export const LeadForm: React.FC<LeadFormProps> = ({ 
  onSubmit, 
  onSuccess, 
  onError, 
  role, 
  className = "",
  redirectPath = "/dashboard/leads",
  mode = 'create',
  initialData,
  onPromoteToInvestor,
  leadId,
  isPromoteLoading,
  canPromote
}) => {
  const [dropdownStates, setDropdownStates] = useState({
    calls: false,
    source: false,
    engine: false,
    quickComment: false,
    lead_created_by: false
  });

  const [isIconRotate, setIsIconRotate] = useState(false);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleDropdown = (dropdown: keyof typeof dropdownStates) => {
    setDropdownStates((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => {
        return {
          ...acc,
          [key]: key === dropdown ? !prev[key as keyof typeof prev] : false
        };
      }, {} as typeof prev)
    }));
  };

  const leads_type = [
    { value: "investor", label: "Investor" },
    { value: "customer", label: "Customer" },
  ];

  const options = [
    { label: "No Calls - Black", value: "No Calls - Black" },
    { label: "1st Call - Red", value: "1st Call - Red" },
    { label: "2nd Call - Purple", value: "2nd Call - Purple" },
    { label: "3rd Call - Green", value: "3rd Call - Green" },
    { label: "4th Call - Blue", value: "4th Call - Blue" },
    { label: "5th Call - Cyan", value: "5th Call - Cyan" },
  ];

  const leadSourceOptions = [
    { value: "Google (Call-In)", label: "Google (Call-In)" },
    { value: "Machinery Trader", label: "Machinery Trader" },
    { value: "Forlift 123", label: "Forlift 123" },
    { value: "Rock & Dirt", label: "Rock & Dirt" },
    { value: "Buyer Zone", label: "Buyer Zone" },
    { value: "Machine", label: "Machine" },
    { value: "Auction", label: "Auction" },
    { value: "Mascus", label: "Mascus" },
  ];

  const engineOptions = [
    { label: "Liquid Propane Gas (LPG)", value: "Liquid propane Gas (LPG)" },
    { label: "Diesel", value: "Diesel" },
    { label: "Gasoline", value: "Gasoline" },
    { label: "Dual Fuel (Gas/LPG)", value: "Dual fuel (Gas/LPG)" },
    { label: "Electric", value: "Electric" },
    { label: "Other", value: "Other" },
    { label: "Not Sure", value: "Not sure" },
  ];

  const quickCommentValues = [
    { label: "Left a Message", value: "Left a Message" },
    { label: "Talked to Customer", value: "Talked to Customer" },
    { label: "Customer Already Bought a List", value: "Customer Already Bought a List" },
  ];

  const createdbyValues = [
    { label: "Arcangelo", value: "Arcangelo" },
    { label: "Myron", value: "Myron" },
  ];

  const formik = useFormik({
    initialValues: {
      lead_type: "",
      name: "",
      title: "",
      company: "",
      phone: "",
      email: "",
      street_address: "",
      city: "",
      state: "",
      zip_code: "",
      number_of_calls: "",
      lead_source: "",
      reminder: "",
      reminder_date_time: null as Date | null,
      reminder_time: null,
      hot_lead: null as boolean | null,
      in_finance: null as boolean | null,
      sourcing: null as boolean | null,
      lift_type: "",
      engine_type: "",
      location_used: "",
      max_capacity: "",
      condition: "",
      budget_min: "",
      budget_max: "",
      financing: "",
      purchase_timeline: "",
      quick_comment: "",
      comments: "",
      lead_created_by: "",
    },
    enableReinitialize: mode === 'edit',
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required("Name is required")
        .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be less than 50 characters"),
      phone: Yup.string()
        .required("Phone is required")
        .test('phone-validation', 'Please enter a valid US phone number', function(value) {
          if (!value) return false;
          
          // Remove all formatting characters
          const cleaned = value.replace(/[\s\(\)\-]/g, '');
          
          // Check for +1 followed by 10 digits
          if (cleaned.startsWith('+1') && cleaned.length === 12) {
            return true;
          }
          
          return false;
        }),
      email: Yup.string().email("Invalid email").required("Email is required"),
      budget_min: Yup.number()
        .min(0, "Budget minimum cannot be negative")
        .nullable(),
      budget_max: Yup.number()
        .min(0, "Budget maximum cannot be negative")
        .nullable()
        .test('budget-range-validation', 'Maximum budget must be greater than minimum', function(value) {
          const { budget_min } = this.parent;
          
          // If both are empty, it's valid
          if (!budget_min && !value) {
            return true;
          }
          
          // If min is filled but max is empty, it's invalid
          if (budget_min && !value) {
            return this.createError({ message: 'Maximum budget is required when minimum is provided' });
          }
          
          // If max is filled but min is empty, it's invalid
          if (!budget_min && value) {
            return this.createError({ message: 'Minimum budget is required when maximum is provided' });
          }
          
          // If both are filled, max must be greater than min
          if (budget_min && value) {
            return value > budget_min;
          }
          
          return true;
        }),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        values.zip_code = String(values.zip_code);
        
        // Normalize phone number format (always +1XXXXXXXXXX)
        if (values.phone) {
          const cleaned = values.phone.replace(/[\s\(\)\-]/g, '');
          values.phone = cleaned; // Already in +1XXXXXXXXXX format
        }
        
        // Only set boolean values if they are explicitly selected (not null)
        if (values.sourcing !== null) {
          values.sourcing = values.sourcing ? true : false;
        }
        if (values.hot_lead !== null) {
          values.hot_lead = values.hot_lead ? true : false;
        }
        if (values.in_finance !== null) {
          values.in_finance = values.in_finance ? true : false;
        }

        let reminderDateTime: string | null = null;

        if (values.reminder_date_time && values.reminder_date_time instanceof Date) {
          const year = values.reminder_date_time.getFullYear();
          const month = (values.reminder_date_time.getMonth() + 1).toString().padStart(2, '0');
          const day = values.reminder_date_time.getDate().toString().padStart(2, '0');
          const hours = values.reminder_date_time.getHours().toString().padStart(2, '0');
          const minutes = values.reminder_date_time.getMinutes().toString().padStart(2, '0');
          const seconds = values.reminder_date_time.getSeconds().toString().padStart(2, '0');
          reminderDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }

        const dataToSubmit = {
          ...values,
          reminder_date_time: reminderDateTime,
        };

        setIsSubmitting(true);
        const response = await onSubmit(dataToSubmit);
        
        if (onSuccess) {
          onSuccess(response);
        } else {
          toast.success(response.message || (mode === 'create' ? 'Lead added successfully' : 'Lead updated successfully'));
        }
        
        // Always navigate after successful submission
        if (mode === 'create') {
          resetForm();
          setSelectedTime(null);
        }
        router.push(redirectPath);
      } catch (error) {
        if (onError) {
          onError(error);
        } else {
          const errorResponse = error as ErrorResponse;
          if (errorResponse?.data?.error) {
            Object.values(errorResponse.data.error).forEach((errorMessage) => {
              toast.error(errorMessage);
            });
                     } else {
             toast.error(mode === 'create' ? "Failed to add lead." : "Failed to update lead.");
           }
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date && selectedTime) {
      const finalDateTime = new Date(date);
      finalDateTime.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      formik.setFieldValue("reminder_date_time", finalDateTime);
    }
  };

  const handleTimeChange = (time: Date | null) => {
    setSelectedTime(time);
    if (time && selectedDate) {
      const finalDateTime = new Date(selectedDate);
      finalDateTime.setHours(time.getHours(), time.getMinutes());
      formik.setFieldValue("reminder_date_time", finalDateTime);
    }
  };

  const handleNavigate = () => {
    NProgress.start();
    router.push(redirectPath);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
    formik.setFieldValue('name', filteredValue);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty field for editing
    if (value === '') {
      formik.setFieldValue('phone', '');
      return;
    }
    
    // If user is typing and field doesn't start with +1, add it
    if (!value.startsWith('+1')) {
      // Add +1 prefix and continue processing
      const valueWithPrefix = '+1 ' + value;
      const digitsOnly = value.replace(/[^\d]/g, '');
      
      if (digitsOnly.length <= 10) {
        let maskedValue = '+1 ';
        if (digitsOnly.length >= 1) maskedValue += `(${digitsOnly.slice(0, 3)}`;
        if (digitsOnly.length >= 4) maskedValue += `) ${digitsOnly.slice(3, 6)}`;
        if (digitsOnly.length >= 7) maskedValue += `-${digitsOnly.slice(6, 10)}`;
        
        formik.setFieldValue('phone', maskedValue);
      }
      return;
    }
    
    // Remove all non-digit characters except the +1 prefix
    let digitsOnly = value.replace(/[^\d]/g, '');
    
    // If it starts with 1, remove it since we always add +1
    if (digitsOnly.startsWith('1')) {
      digitsOnly = digitsOnly.substring(1);
    }
    
    // Always start with +1 and apply US masking
    if (digitsOnly.length <= 10) {
      // Apply US phone number mask with +1: +1 (XXX) XXX-XXXX
      let maskedValue = '+1 ';
      if (digitsOnly.length >= 1) maskedValue += `(${digitsOnly.slice(0, 3)}`;
      if (digitsOnly.length >= 4) maskedValue += `) ${digitsOnly.slice(3, 6)}`;
      if (digitsOnly.length >= 7) maskedValue += `-${digitsOnly.slice(6, 10)}`;
      
      formik.setFieldValue('phone', maskedValue);
    }
  };

  const handlePhoneFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // If field is empty, add +1 prefix
    if (!formik.values.phone) {
      formik.setFieldValue('phone', '+1 ');
    }
  };

  const handleBudgetMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow digits and a single decimal point
    const cleanValue = value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = cleanValue.split('.');
    if (parts.length <= 2) {
      formik.setFieldValue('budget_min', cleanValue);
    }
  };

  const handleBudgetMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow digits and a single decimal point
    const cleanValue = value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = cleanValue.split('.');
    if (parts.length <= 2) {
      formik.setFieldValue('budget_max', cleanValue);
    }
  };

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      // Set the initial values for formik to reinitialize
      formik.setFieldValue('lead_type', initialData.lead_type || "");
      formik.setFieldValue('name', initialData.name || "");
      formik.setFieldValue('title', initialData.title || "");
      formik.setFieldValue('company', initialData.company || "");
             // Format existing phone number to show +1 (XXX) XXX-XXXX
       if (initialData.phone) {
         const cleaned = initialData.phone.replace(/[\s\(\)\-]/g, '');
         if (cleaned.startsWith('+1') && cleaned.length === 12) {
           // Convert +1XXXXXXXXXX to +1 (XXX) XXX-XXXX
           const digits = cleaned.substring(2); // Remove +1
           const formatted = `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
           formik.setFieldValue('phone', formatted);
         } else {
           formik.setFieldValue('phone', initialData.phone);
         }
       } else {
         formik.setFieldValue('phone', "");
       }
      formik.setFieldValue('email', initialData.email || "");
      formik.setFieldValue('street_address', initialData.street_address || "");
      formik.setFieldValue('city', initialData.city || "");
      formik.setFieldValue('state', initialData.state || "");
      formik.setFieldValue('zip_code', initialData.zip_code || "");
      formik.setFieldValue('number_of_calls', initialData.number_of_calls || "");
      formik.setFieldValue('lead_source', initialData.lead_source || "");
      formik.setFieldValue('reminder', initialData.reminder || "");
      formik.setFieldValue('reminder_date_time', initialData.reminder_date_time ? new Date(initialData.reminder_date_time) : null);
      // Convert numeric values to booleans for radio buttons
      formik.setFieldValue('hot_lead', initialData.hot_lead === 1 || initialData.hot_lead === true);
      formik.setFieldValue('in_finance', initialData.in_finance === 1 || initialData.in_finance === true);
      formik.setFieldValue('sourcing', initialData.sourcing === 1 || initialData.sourcing === true);
      formik.setFieldValue('lift_type', initialData.lift_type || "");
      formik.setFieldValue('engine_type', initialData.engine_type || "");
      formik.setFieldValue('location_used', initialData.location_used || "");
      formik.setFieldValue('max_capacity', initialData.max_capacity || "");
      formik.setFieldValue('condition', initialData.condition || "");
      formik.setFieldValue('budget_min', initialData.budget_min || "");
      formik.setFieldValue('budget_max', initialData.budget_max || "");
      formik.setFieldValue('financing', initialData.financing || "");
      formik.setFieldValue('purchase_timeline', initialData.purchase_timeline || "");
      formik.setFieldValue('quick_comment', initialData.quick_comment || "");
      formik.setFieldValue('comments', initialData.comments || "");
      formik.setFieldValue('lead_created_by', initialData.lead_created_by || "");
      
      // Set date and time separately
      if (initialData.reminder_date_time) {
        const date = new Date(initialData.reminder_date_time);
        setSelectedDate(date);
        setSelectedTime(date);
      } else {
        setSelectedDate(null);
        setSelectedTime(null);
      }
    }
  }, [mode, initialData]);

  return (
    <div className={className}>
      <div className="container-fluid">
        <form onSubmit={formik.handleSubmit}>
          <div className="row mb-2">
            <div className="grid grid-cols-1">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <IoMdArrowRoundBack onClick={handleNavigate} className="text-[1.5rem] mt-2 cursor-pointer" />
                  <div className="flex items-center justify-between text-[25px] font-extrabold">
                    <h3 className="">{mode === 'create' ? 'Add New Lead' : 'Edit Lead'}</h3>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className="text-[13px] font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <ButtonLoader/> : mode === 'create' ? " Add Lead" : " Update Lead"}
                  </Button>
                  {mode === 'edit' && onPromoteToInvestor && canPromote && (
                    <Button
                      variant="primary"
                      className="text-[13px] font-semibold"
                      onClick={() => onPromoteToInvestor(leadId!)}
                      disabled={isPromoteLoading}
                    >
                      {isPromoteLoading ? "Promoting..." : "Promote to Investor"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 gap-4">
              {/* Contact Information */}
              <div className="bg-white w-full rounded p-3">
                <h1 className="text-[#000] text-[14px] font-family font-medium mb-1">Contact Information</h1>
                <div>
                  <label className="text-[11.5px] text-[#818181] font-normal font-family">
                    Lead Type <span className="text-red-500">*</span>
                  </label>   
                  <LeadSelect
                    name="lead_type"
                    value={formik.values.lead_type}
                    options={leads_type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.lead_type ? formik.errors.lead_type : undefined}
                  />
                </div>
                <div>
                  <AddLeadInput
                    label="Name"
                    name="name"
                    value={formik.values.name}
                    onChange={handleNameChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && formik.errors.name}
                    isRequired={true}
                    placeholder="Enter Your Name"
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
                  )}
                </div>
                <div className="">
                  <AddLeadInput
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="Title"
                    placeholder="Enter Title"
                  />
                  {formik.touched.title && formik.errors.title && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.title}</p>
                  )}
                </div>
                <div className="">
                  <AddLeadInput
                    name="company"
                    value={formik.values.company}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="Company"
                    placeholder="Enter Company"
                  />
                  {formik.touched.company && formik.errors.company && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.company}</p>
                  )}
                </div>
                <div className="">
                  <AddLeadInput
                    label="Phone"
                    name="phone"
                    value={formik.values.phone}
                    onChange={handlePhoneChange}
                    onFocus={handlePhoneFocus}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phone && formik.errors.phone}
                    isRequired={true}
                    placeholder="+1 (XXX) XXX-XXXX"
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.phone}</p>
                  )}
                </div>
                <div className="">
                  <AddLeadInput
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && formik.errors.email}
                    label="Email"
                    isRequired={true}
                    placeholder="Enter Your Email"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
                  )}
                </div>
                <div className="">
                  <AddLeadInput
                    name="street_address"
                    value={formik.values.street_address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="Street Address"
                    placeholder="Enter Street Address"
                  />
                  {formik.touched.street_address && formik.errors.street_address && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.street_address}</p>
                  )}
                </div>
                <div className="">
                  <AddLeadInput
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="City"
                    placeholder="Enter City"
                  />
                  {formik.touched.city && formik.errors.city && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.city}</p>
                  )}
                </div>
                <div className="">
                  <AddLeadInput
                    name="state"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="State"
                    placeholder="Enter State"
                  />
                  {formik.touched.state && formik.errors.state && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.state}</p>
                  )}
                </div>
                <div>
                  <AddLeadInput
                    name="zip_code"
                    value={formik.values.zip_code}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="Zip Code"
                    type="text"
                    placeholder="Enter Zip Code"
                  />
                  {formik.touched.zip_code && formik.errors.zip_code && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.zip_code}</p>
                  )}
                </div>
              </div>

              {/* Lead Details */}
              <div className="w-full bg-white rounded p-3 h-[350px]">
                <h1 className="text-[#000] text-[14px] font-family font-medium mb-2">Lead Details</h1>

                <div className="relative w-full">
                  <label className="text-[11.5px] text-[#818181] font-normal font-family">Number of Calls</label>
                  <LeadSelect
                    name="number_of_calls"
                    value={formik.values.number_of_calls}
                    options={options}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.number_of_calls ? formik.errors.number_of_calls : undefined}
                  />
                </div>

                <div className="relative w-full">
                  <label className="text-[11.5px] text-[#818181] font-normal font-family">Lead Source</label>
                  <LeadSelect
                    name="lead_source"
                    value={formik.values.lead_source}
                    options={leadSourceOptions}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.lead_source ? formik.errors.lead_source : undefined}
                  />
                </div>

                <div className="">
                  <AddLeadInput
                    name="reminder"
                    value={formik.values.reminder}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="Reminder"
                    placeholder="Enter Reminder"
                  />
                  {formik.touched.reminder && formik.errors.reminder && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.lead_source}</p>
                  )}
                </div>

                <div className="mb-2">
                  <label className="text-xs text-gray-500 font-family font-medium">Reminder Date & Time</label>
                  <div className="flex justify-between items-center gap-2 mt-1">
                    {/* Date Picker */}
                    <div className="relative w-full">
                      <DatePicker
                        selected={formik.values.reminder_date_time}
                        onChange={date => formik.setFieldValue('reminder_date_time', date)}
                        minDate={new Date()}
                        dateFormat="dd/MM/yyyy"
                        className="w-full px-3 py-1 cursor-pointer text-sm pr-10 border border-[#E8E8E8] rounded-xs outline-0 text-[#666] placeholder-[#666666] text-[12px]"
                        placeholderText="Select Date"
                        customInput={
                          <div style={{ position: 'relative', width: '100%' }}>
                            <input
                              className="w-full px-0 py-0 cursor-pointer text-sm pr-10 outline-0 text-[#666] placeholder-[#666666] text-[12px]"
                              value={formik.values.reminder_date_time ? formik.values.reminder_date_time.toLocaleDateString() : ''}
                              readOnly
                              ref={dateInputRef}
                              placeholder='Select Date'
                            />
                            <FiCalendar
                              className="absolute right-2 top-1 w-[14px] h-[14px] text-gray-500 cursor-pointer"
                              onClick={() => dateInputRef.current?.focus()}
                            />
                          </div>
                        }
                      />
                    </div>

                    {/* Time Picker */}
                    <div className="relative w-full">
                      <DatePicker
                        selected={selectedTime}
                        onChange={handleTimeChange}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeFormat="h:mm aa"
                        dateFormat="h:mm aa"
                        placeholderText="Select Time"
                        className="w-full px-3 py-1 border text-sm border-[#E8E8E8] text-[#666] rounded-xs focus:outline-none"
                      />
                      <FiChevronDown className="absolute right-2 top-2 text-gray-500 w-[14px] h-[14px] cursor-pointer" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-5 items-center">
                  <div className="flex justify-between gap-5 items-center">
                    <div>
                      <ul className="">
                        <li className="text-[#818181] text-[11.5px] font-normal font-family">Hot Lead</li>
                        <li className="text-[#818181] text-[11.5px] font-normal font-family">In Finance</li>
                        <li className="text-[#818181] text-[11.5px] font-normal font-family">Sourcing</li>
                      </ul>
                    </div>
                    <div>
                      <div className="flex gap-1 items-center">
                        <RadioButton
                          isSelected={formik.values.hot_lead === true}
                          onSelect={() => formik.setFieldValue("hot_lead", true)}
                        />
                        <label className="text-[#666] text-[13px] font-medium font-family">Yes</label>
                      </div>
                      <div className="flex gap-1 items-center">
                        <RadioButton
                          isSelected={formik.values.in_finance === true}
                          onSelect={() => formik.setFieldValue("in_finance", true)}
                        />
                        <label className="text-darkGray text-sm font-family">Yes</label>
                      </div>
                      <div className="flex gap-1 items-center">
                        <RadioButton
                          isSelected={formik.values.sourcing === true}
                          onSelect={() => formik.setFieldValue("sourcing", true)}
                        />
                        <label className="text-[#666] text-[13px] font-medium font-family">Yes</label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex gap-1 items-center">
                      <RadioButton
                        isSelected={formik.values.hot_lead === false}
                        onSelect={() => formik.setFieldValue("hot_lead", false)}
                      />
                      <label className="text-[#666] text-[13px] font-medium font-family">No</label>
                    </div>
                    <div className="flex gap-1 items-center">
                      <RadioButton
                        isSelected={formik.values.in_finance === false}
                        onSelect={() => formik.setFieldValue("in_finance", false)}
                      />
                      <label className="text-[#666] text-[13px] font-medium font-family">No</label>
                    </div>
                    <div className="flex gap-1 items-center">
                      <RadioButton
                        isSelected={formik.values.sourcing === false}
                        onSelect={() => formik.setFieldValue("sourcing", false)}
                      />
                      <label className="text-[#666] text-[13px] font-medium font-family">No</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Equipment Requirements */}
              <div>
                <div className="mb-5 bg-white w-full rounded p-3 ">
                  <h1 className="text-[#000] text-[14px] font-family font-medium mb-2">Equipment Requirements</h1>
                  <div className="">
                    <AddLeadInput
                      name="lift_type"
                      value={formik.values.lift_type}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label="Lift Type"
                      placeholder="Enter Lift Type"
                    />
                    {formik.touched.lift_type && formik.errors.lift_type && (
                      <p className="text-red-500 text-xs mt-1">{formik.errors.lift_type}</p>
                    )}
                  </div>

                  <div className="relative w-full">
                    <label className="text-[11.5px] text-[#818181] font-normal font-family">Engine Type</label>
                    <LeadSelect
                      name="engine_type"
                      value={formik.values.engine_type}
                      options={engineOptions}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.engine_type ? formik.errors.engine_type : undefined}
                    />
                  </div>

                  <div className="">
                    <AddLeadInput
                      name="location_used"
                      value={formik.values.location_used}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label="Location Used"
                      placeholder="Enter Location Used"
                    />
                    {formik.touched.location_used && formik.errors.location_used && (
                      <p className="text-red-500 text-xs mt-1">{formik.errors.location_used}</p>
                    )}
                  </div>
                  <div className="">
                    <AddLeadInput
                      name="max_capacity"
                      value={formik.values.max_capacity}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label="Max Capacity"
                      type="number"
                      placeholder="Enter Max Capacity "
                    />
                    {formik.touched.max_capacity && formik.errors.max_capacity && (
                      <p className="text-red-500 text-xs mt-1">{formik.errors.max_capacity}</p>
                    )}
                  </div>
                  <div className="">
                    <label className="text-[#666] text-[13px] font-medium font-family">Condition</label>
                    <div className="flex gap-4 items-center">
                      <p className="flex gap-2">
                        <RadioButton
                          isSelected={formik.values.condition === "New"}
                          onSelect={() => formik.setFieldValue("condition", "New")}
                        />
                        <label className="text-[#666] text-[13px] font-medium font-family">New</label>
                      </p>
                      <p className="flex gap-2">
                        <RadioButton
                          isSelected={formik.values.condition === "Used"}
                          onSelect={() => formik.setFieldValue("condition", "Used")}
                        />
                        <label className="text-[#666] text-[13px] font-medium font-family">Used</label>
                      </p>
                      <p className="flex gap-2">
                        <RadioButton
                          isSelected={formik.values.condition === "New/Used"}
                          onSelect={() => formik.setFieldValue("condition", "New/Used")}
                        />
                        <label className="text-[#666] text-[13px] font-medium font-family">New/Used</label>
                      </p>
                    </div>
                    {formik.touched.condition && formik.errors.condition && (
                      <p className="text-red-500 text-xs mt-1">{formik.errors.condition}</p>
                    )}
                  </div>
                </div>

                {/* Budget & Financing */}
                <div className="mb-5 bg-white w-full p-3">
                  <h1 className="text-black font-family font-medium mb-2">Budget & Financing</h1>
                  <div className="">
                    <label className="text-xs text-gray-500 font-family font-medium">Budget Range</label>
                                         <div className="flex gap-3 items-center">
                                               <div className="flex-1">
                                                     <input
                             type="text"
                             name="budget_min"
                             value={formik.values.budget_min}
                             onChange={handleBudgetMinChange}
                             onBlur={formik.handleBlur}
                             placeholder="$ 1.00"
                             className="w-full text-left mt-1 text-[#666] placeholder-[#666666] text-[12px] font-medium font-family border flex justify-between items-center border-[#E8E8E8] px-2 py-1.5 rounded-xs outline-none"
                           />
                                                 </div>
                        <span className="text-[#666] text-[12px] font-medium">-</span>
                                                <div className="flex-1">
                                                      <input
                              type="text"
                              name="budget_max"
                              value={formik.values.budget_max}
                              onChange={handleBudgetMaxChange}
                              onBlur={formik.handleBlur}
                              placeholder="$ 100.00"
                              className="w-full text-left text-[#666] placeholder-[#666666] text-[12px] font-medium font-family border flex justify-between items-center border-[#E8E8E8] px-2 py-1.5 rounded-xs mt-1 outline-none"
                            />
                        </div>
                      </div>
                      {/* Show single budget range validation error below both fields */}
                      {(formik.touched.budget_min || formik.touched.budget_max) && 
                       (formik.errors.budget_min || formik.errors.budget_max) && (
                        <p className="text-red-500 text-xs mt-1">
                          {formik.errors.budget_min || formik.errors.budget_max}
                        </p>
                      )}
                  </div>

                  <div className="">
                    <AddLeadInput
                      name="financing"
                      value={formik.values.financing}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label="Financing"
                      placeholder="Enter Financing"
                    />
                    {formik.touched.financing && formik.errors.financing && (
                      <p className="text-red-500 text-xs mt-1">{formik.errors.financing}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <div className="bg-white p-3 rounded w-full mb-5">
                  <h1 className="text-[#000] text-[14px] font-family font-medium mb-2">Purchase Timeline</h1>
                  <div className="flex gap-7">
                    <div>
                      <ul className="">
                        <li className="flex gap-2 items-center font-family pb-1">
                          <RadioButton
                            isSelected={formik.values.purchase_timeline === "ASAP"}
                            onSelect={() => formik.setFieldValue("purchase_timeline", "ASAP")}
                          />
                          <label className="text-[#666] text-[13px] font-medium font-family">ASAP</label>
                        </li>
                        <li className="flex gap-2 items-center pb-1 font-family">
                          <RadioButton
                            isSelected={formik.values.purchase_timeline === "In 1 Month"}
                            onSelect={() => formik.setFieldValue("purchase_timeline", "In 1 Month")}
                          />
                          <label className="text-[#666] text-[13px] font-medium font-family">In 1 Month</label>
                        </li>
                        <li className="flex gap-2 items-center font-family">
                          <RadioButton
                            isSelected={formik.values.purchase_timeline === "In 2 Months"}
                            onSelect={() => formik.setFieldValue("purchase_timeline", "In 2 Months")}
                          />
                          <label className="text-[#666] text-[13px] font-medium font-family">In 2 Months</label>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <ul>
                        <li className="flex gap-2 items-center font-family">
                          <RadioButton
                            isSelected={formik.values.purchase_timeline === "More than 2 Months"}
                            onSelect={() => formik.setFieldValue("purchase_timeline", "More than 2 Months")}
                          />
                          <label className="text-[#666] text-[13px] font-medium font-family">2+ Months</label>
                        </li>
                        <li className="flex gap-2 items-center">
                          <RadioButton
                            isSelected={formik.values.purchase_timeline === "3+ Months"}
                            onSelect={() => formik.setFieldValue("purchase_timeline", "3+ Months")}
                          />
                          <label className="text-[#666] text-[13px] font-medium font-family">3+ Months</label>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-3 w-full">
                  <h1 className="text-black font-medium mb-2 font-family">Additional Information</h1>
                  <div className="relative w-full">
                    <label className="text-[11.5px] text-[#818181] font-normal font-family">Quick Comment</label>
                    <LeadSelect
                      name="quick_comment"
                      value={formik.values.quick_comment}
                      options={quickCommentValues}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.quick_comment ? formik.errors.quick_comment : undefined}
                    />
                  </div>

                  <div className="">
                    <div className="flex flex-col">
                      <label className="font-medium font-family text-xs text-gray-500">Comments</label>
                      <textarea
                        name="comments"
                        value={formik.values.comments}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        rows={5}
                        placeholder="Enter Your Comment"
                        className="w-full text-left mt-1 text-[#666] placeholder-[#666666] text-xs font-medium font-family text-md border flex justify-between items-center border-[#E8E8E8] px-2 py-1.5 rounded-xs"
                      />
                    </div>
                  </div>

                  <div className="relative w-full">
                    <label className="text-[11.5px] text-[#818181] font-normal font-family">Lead Created By</label>
                    <LeadSelect
                      name="lead_created_by"
                      value={formik.values.lead_created_by}
                      options={createdbyValues}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.lead_created_by ? formik.errors.lead_created_by : undefined}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}; 