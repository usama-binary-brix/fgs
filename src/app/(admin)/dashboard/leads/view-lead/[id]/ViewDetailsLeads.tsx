'use client'
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik';
import AddLeadInput from '../../components/input/AddLeadInput';
import { useEditLeadMutation, useGetLeadByIdQuery, usePromoteToInvestorMutation } from '@/store/services/api';
import { toast } from 'react-toastify';
import { FiCalendar, FiChevronDown } from 'react-icons/fi';
import RadioButton from '../../components/radiobutton/RadioButton';
import Button from '@/components/ui/button/Button';
import { IoMdArrowRoundBack } from 'react-icons/io';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ButtonLoader from '@/components/ButtonLoader';
type ErrorResponse = {
  data: {
    error: Record<string, string>; // `error` contains field names as keys and error messages as values
  };
};

const ViewDetailsLeads = () => {
  const { id } = useParams();
  const { data: leadData, error, isLoading } = useGetLeadByIdQuery(id);
  const [isEditing, setIsEditing] = useState(true);
  const [editLead] = useEditLeadMutation()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dropdownStates, setDropdownStates] = useState({
    calls: false,
    source: false,
    engine: false,
    quickComment: false,
    lead_created_by: false
  });
  const options = [
    { label: "No Calls - Black", value: "No Calls - Black" },
    { label: "1st Call - Red", value: "1st Call - Red" },
    { label: "2nd Call - Purple", value: "2nd Call - Purple" },
    { label: "3rd Call - Green", value: "3rd Call - Green" },
    { label: "4th Call - Blue", value: "4th Call - Blue" },
    { label: "5th Call - Cyan", value: "5th Call - Cyan" },
  ];

  const leadSourceOptions = [
    { value: "Google (Call-In)" },
    { value: "Machinery Trader" },
    { value: "Forlift 123" },
    { value: "Rock & Dirt" },
    { value: "Buyer Zone" },
    { value: "Machine" },
    { value: "Auction" },
    { value: "Mascus" },
  ];

  const engineOptions = [
    { value: "Liquid propane Gas (LPG)" },
    { value: "Diesel" },
    { value: "Gasoline" },
    { value: "Dual fuel (Gas/LPG)" },
    { value: "Electric" },
    { value: "Other" },
    { value: "Not sure" },
  ];

  const quickCommentValues = [
    { value: "Left a Message" },
    { value: "Talked to Customer" },
    { value: "Customer Already Bought a List" },
  ];
  const createdbyValues = [
    { value: "Arcangelo" },
    { value: "Myron" },
  ];
  const formik = useFormik({
    initialValues: {
      name: '',
      title: '',
      company: '',
      phone: '',
      email: '',
      street_address: '',
      city: '',
      state: '',
      zip_code: '',
      number_of_calls: '',
      lead_source: '',
      reminder: '',
      reminder_date_time: null as Date | null,
      reminder_time: null as Date | null,
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
    onSubmit: async (values, { resetForm, setSubmitting }) => {

      let reminderDateTime: string | null = null;
      if (values.reminder_date_time instanceof Date) {
        const year = values.reminder_date_time.getFullYear();
        const month = String(values.reminder_date_time.getMonth() + 1).padStart(2, '0');
        const day = String(values.reminder_date_time.getDate()).padStart(2, '0');
        const hours = String(values.reminder_date_time.getHours()).padStart(2, '0');
        const minutes = String(values.reminder_date_time.getMinutes()).padStart(2, '0');
        const seconds = String(values.reminder_date_time.getSeconds()).padStart(2, '0');
        reminderDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }
      const updatedValues = {
        ...values,
        id: Number(id),
        hot_lead: values.sourcing ? true : false,
        in_finance: values.hot_lead ? true : false,
        sourcing: values.in_finance ? true : false,
        reminder_date_time: reminderDateTime,

      };
      try {
        setIsSubmitting(true)
        const response = await editLead(updatedValues).unwrap();
        toast.success(response.message);
        router.push('/dashboard/leads')
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
      } finally {
        setIsSubmitting(false)
      }
      setIsEditing(false)
    },

  });

  useEffect(() => {
    if (leadData?.lead) {
      const backendDate = leadData?.lead.reminder_date_time
        ? new Date(leadData.lead.reminder_date_time)
        : null;

      formik.setValues({
        name: leadData.lead.name || '',
        title: leadData.lead.title || '',
        company: leadData.lead.company || '',
        phone: leadData.lead.phone || '',
        email: leadData.lead.email || '',
        street_address: leadData.lead.street_address || '',
        city: leadData.lead.city || '',
        state: leadData.lead.state || '',
        zip_code: leadData.lead.zip_code || '',
        number_of_calls: leadData.lead.number_of_calls || '',
        lead_source: leadData.lead.lead_source || '',
        reminder: leadData.lead.reminder || '',
        reminder_date_time: backendDate,
        reminder_time: backendDate,

        hot_lead: leadData.lead.hot_lead === 1,
        in_finance: leadData.lead.in_finance === 1,
        sourcing: leadData.lead.sourcing === 1,

        lift_type: leadData.lead.lift_type || "",
        engine_type: leadData.lead.engine_type || "",
        location_used: leadData.lead.location_used || "",
        max_capacity: leadData.lead.max_capacity || "",
        condition: leadData.lead.condition || "",
        budget_min: leadData.lead.budget_min || "",
        budget_max: leadData.lead.budget_max || "",
        financing: leadData.lead.financing || "",
        purchase_timeline: leadData.lead.purchase_timeline || "",
        quick_comment: leadData.lead.quick_comment || "",
        comments: leadData.lead.comments || "",
        lead_created_by: leadData.lead.lead_created_by || "",
      });
      if (backendDate) {
        const onlyDate = new Date(
          backendDate.getFullYear(),
          backendDate.getMonth(),
          backendDate.getDate()
        );
        const onlyTime = new Date(backendDate);

        setSelectedDate(onlyDate);
        setSelectedTime(onlyTime);
      } else {
        setSelectedDate(null);
        setSelectedTime(null);
      }
    }
  }, [leadData?.lead]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date && selectedTime) {
      // Combine date & time
      const finalDateTime = new Date(date);
      finalDateTime.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      formik.setFieldValue("reminder_date_time", finalDateTime);
    }
  };

  const handleTimeChange = (time: Date | null) => {
    setSelectedTime(time);
    if (time && selectedDate) {
      // Combine date & time
      const finalDateTime = new Date(selectedDate);
      finalDateTime.setHours(time.getHours(), time.getMinutes());
      formik.setFieldValue("reminder_date_time", finalDateTime);
    }
  };

  const matchedOption = options.find(option => option.value === formik.values.number_of_calls);
  const [promoteInvestor, { isLoading: isPromoteLoading }] = usePromoteToInvestorMutation();
  const handlePromoteClick = async (leadId: any) => {
    try {
      const response = await promoteInvestor({
        lead_id: leadId,
        type: "promote_to_investor",
      }).unwrap();

      toast.success("Investor promoted successfully!");
    } catch (error) {
      const err = error as { data?: { error?: string } };
      toast.error(err.data?.error || "Email is Already Promoted");
    }
  };


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
  const handleNavigate = () => {
    router.push('/dashboard/leads')
  }

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="flex justify-between items-center mb-4">
          <div className='flex gap-4 items-center'>
            <IoMdArrowRoundBack onClick={handleNavigate} className="text-[1.5rem] cursor-pointer" />

            <h1 className="text-3xl font-bold">{leadData?.lead?.listing_number}</h1>
          </div>
          <div className="flex gap-2">

            <div className='flex items-center gap-4'>

              <Button
                type="submit"
                variant="primary"
                className='font-semibold'
                disabled={isSubmitting || leadData?.lead?.type !== 'lead'}
              >
                {isSubmitting ? <ButtonLoader/> : 'Update'}
              </Button>
              <Button variant="primary"
                className='font-semibold'
                onClick={() => handlePromoteClick(id)}
                disabled={leadData?.lead?.type !== 'lead'}

              >

                {isPromoteLoading ? <ButtonLoader/> : (leadData?.lead?.type === 'lead' ? "Promote to Investor" : "Already Promoted")}
              </Button>
            </div>

          </div>
        </div>
        <div className="row">
          <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 gap-4">
            <div className="bg-white w-full rounded p-3">
              <h1 className="text-[#000] text-[14px] font-family font-medium mb-2">Contact Information</h1>

              {/* <AddLeadInput label="Name" name="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={!isEditing} />
            <AddLeadInput label="Title" name="title" value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={!isEditing} />
            <AddLeadInput label="Company" name="company" value={formik.values.company} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={!isEditing} />
            <AddLeadInput label="Phone" name="phone" value={formik.values.phone} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={!isEditing} />
            <AddLeadInput label="Email" name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={!isEditing} />
            <AddLeadInput label="Street Address" name="street_address" value={formik.values.street_address} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={!isEditing} />
            <AddLeadInput label="City" name="city" value={formik.values.city} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={!isEditing} />
            <AddLeadInput label="State" name="state" value={formik.values.state} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={!isEditing} />
            <AddLeadInput label="Zip Code" name="zip_code" value={formik.values.zip_code} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={!isEditing} />
          */}
              <div>

                <AddLeadInput
                  label="Name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
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
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phone && formik.errors.phone}
                  isRequired={true}
                  placeholder="Enter Your Phone"

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

            <div className="w-full bg-white rounded p-3 h-[350px]">
              <h1 className="text-[#000] text-[14px] font-family font-medium mb-2">Lead Details</h1>

              <div className="relative w-full">
                <label className="text-xs text-gray-500 font-family font-medium">Number of Calls</label>
                <button
                  type="button"
                  className="w-full text-left mt-1 text-[#666] placeholder-[#666] text-[12px] font-medium  font-family text-md border flex justify-between items-center border-[#E8E8E8] px-2 py-1.5 rounded-xs bg-white focus:outline-none"
                  onClick={() => toggleDropdown('calls')}
                >
                  {formik.values.number_of_calls || "Select an option"}
                  <FiChevronDown
                    className={`text-lg transition-transform duration-300 ${dropdownStates.calls ? "rotate-180" : "rotate-0"}`}
                  />
                </button>

                {dropdownStates.calls && (
                  <ul className="absolute w-full bg-white border z-10 border-gray-300 rounded-md shadow-md mt-1">
                    {options.map((option, index) => (
                      <li
                        key={index}
                        className="px-3 py-2 text-darkGray font-family hover:bg-text hover:text-yellow text-xs cursor-pointer"
                        onClick={() => {
                          formik.setFieldValue("number_of_calls", option.value);
                          toggleDropdown('calls');
                        }}
                      >
                        {option.label}
                      </li>
                    ))}
                  </ul>
                )}
                {formik.touched.number_of_calls && formik.errors.number_of_calls && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.number_of_calls}</p>
                )}
              </div>

              {/* Lead Source Dropdown */}
              <div className="relative w-full">
                <label className="text-xs text-gray-500 font-family">Lead Source</label>
                <button
                  type="button"
                  className="w-full text-left mt-1 text-[#666] placeholder-[#666] text-[12px] font-medium  font-family text-md border flex justify-between items-center border-[#E8E8E8] px-2 py-1.5 rounded-xs bg-white focus:outline-none"
                  onClick={() => toggleDropdown('source')}
                >
                  {formik.values.lead_source || "Select a source"}
                  <FiChevronDown
                    className={`text-lg transition-transform duration-300 ${dropdownStates.source ? "rotate-180" : "rotate-0"}`}
                  />
                </button>
                {dropdownStates.source && (
                  <ul className="absolute w-full bg-white border z-10 border-gray-300 rounded-md shadow-md mt-1">
                    {leadSourceOptions.map((option, index) => (
                      <li
                        key={index}
                        className="px-3 py-2 text-darkGray hover:bg-gray-100 text-xs cursor-pointer"
                        onClick={() => {
                          formik.setFieldValue("lead_source", option.value);
                          toggleDropdown('source');
                        }}
                      >
                        {option.value}
                      </li>
                    ))}
                  </ul>
                )}
                {formik.touched.lead_source && formik.errors.lead_source && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.lead_source}</p>
                )}
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
                      selected={selectedDate}
                      onChange={handleDateChange} // Handles only date
                      dateFormat="dd/MM/yyyy"
                      className="w-full px-3 py-1 cursor-pointer text-sm pr-10 border border-[#E8E8E8] rounded-xs outline-0 text-[#666] placeholder-[#666] text-[12px]"
                      placeholderText="Select Date"
                    />
                    <FiCalendar className="absolute right-2 top-2 w-[14px] h-[14px] text-gray-500 cursor-pointer" />
                  </div>

                  {/* Time Picker */}
                  <div className="relative w-full">
                    <DatePicker
                      selected={selectedTime}
                      onChange={handleTimeChange} // Handles only time
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeFormat="h:mm aa"
                      dateFormat="h:mm aa"
                      placeholderText="Select Time"
                      className="w-full px-3 py-1 border text-sm border-[#E8E8E8] text-[#666] text-[12px] rounded-xs focus:outline-none"
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
                  <div className="">
                    <div className="relative w-full mb-2">
                      <label className="text-xs text-gray-500 font-family font-medium">Engine Type</label>
                      <button
                        type="button"
                        className="w-full text-left mt-1 text-[#666] placeholder-[#666] text-[12px] font-medium  font-family text-md border flex justify-between items-center border-[#E8E8E8] px-2 py-1.5 rounded-xs bg-white focus:outline-none"
                        onClick={() => toggleDropdown('engine')}
                      >
                        {formik.values.engine_type || "Select an engine"}
                        <FiChevronDown
                          className={`text-lg transition-transform duration-300 ${dropdownStates.engine ? "rotate-180" : "rotate-0"}`}
                        />
                      </button>
                      {dropdownStates.engine && (
                        <ul className="absolute w-full bg-white border z-10 border-gray-300 rounded-md shadow-md mt-1">
                          {engineOptions.map((option, index) => (
                            <li
                              key={index}
                              className="px-3 py-2 text-darkGray font-family hover:bg-gray-100 text-xs cursor-pointer"
                              onClick={() => {
                                formik.setFieldValue("engine_type", option.value);
                                toggleDropdown('engine');
                              }}
                            >
                              {option.value}
                            </li>
                          ))}
                        </ul>
                      )}
                      {formik.touched.engine_type && formik.errors.engine_type && (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.engine_type}</p>
                      )}
                    </div>
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
                    <label className="text-xs text-gray-500 font-family font-medium">Budget</label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="number"
                        name="budget_min"
                        value={formik.values.budget_min}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="$ 0.00"
                        className="w-full text-left mt-1 text-[#666] placeholder-[#666] text-[12px] font-medium  font-family text-md border flex justify-between items-center border-[#E8E8E8] px-2 py-1.5 rounded-xs outline-none text-md"
                      />
                      {formik.touched.budget_min && formik.errors.budget_min && (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.budget_min}</p>
                      )}
                      -
                      <input
                        type="number"
                        name="budget_max"
                        value={formik.values.budget_max}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="$ 0.00"
                        className="w-full text-left  text-[#666] placeholder-[#666] text-[12px] font-medium  font-family text-md border flex justify-between items-center border-[#E8E8E8] px-2 py-1.5 rounded-xs mt-1 outline-none text-md"
                      />
                      {formik.touched.budget_max && formik.errors.budget_max && (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.budget_max}</p>
                      )}
                    </div>
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
            </div>
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
                      <li className="flex gap-2 items-center">
                        <RadioButton
                          isSelected={formik.values.purchase_timeline === "3+ Months"}
                          onSelect={() => formik.setFieldValue("purchase_timeline", "3+ Months")}
                        />
                        <label className="text-[#666] text-[13px] font-medium font-family">3+ Months</label>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <ul>
                      <li className="flex gap-2 items-center font-family">
                        <RadioButton
                          isSelected={formik.values.purchase_timeline === "In 2 Months"}
                          onSelect={() => formik.setFieldValue("purchase_timeline", "In 2 Months")}
                        />
                        <label className="text-[#666] text-[13px] font-medium font-family">In 2 Months</label>
                      </li>
                      <li className="flex gap-2 items-center font-family">
                        <RadioButton
                          isSelected={formik.values.purchase_timeline === "More than 2 Months"}
                          onSelect={() => formik.setFieldValue("purchase_timeline", "More than 2 Months")}
                        />
                        <label className="text-[#666] text-[13px] font-medium font-family">2+ Months</label>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 w-full">
                <h1 className="text-black font-medium mb-2 font-family">Additional Information</h1>
                <div className="mb-2">
                  <div className="relative w-full">
                    <label className="text-xs text-gray-500 font-family font-medium">Quick Comment</label>
                    <button
                      type="button"
                      className="w-full text-left px-2 mt-1 text-[#666] placeholder-[#666] text-[12px] font-medium  font-family text-md border flex justify-between items-center border-[#E8E8E8] py-1.5 rounded-xs bg-white focus:outline-none"
                      onClick={() => toggleDropdown('quickComment')}
                    >
                      {formik.values.quick_comment || "Select a comment"}
                      <FiChevronDown
                        className={`text-lg transition-transform duration-300 ${dropdownStates.quickComment ? "rotate-180" : "rotate-0"}`}
                      />
                    </button>
                    {dropdownStates.quickComment && (
                      <ul className="absolute w-full bg-white border z-10 border-gray-300 rounded-md shadow-md mt-1">
                        {quickCommentValues.map((option, index) => (
                          <li
                            key={index}
                            className="px-3 py-2 text-darkGray font-family hover:bg-gray-100 text-xs cursor-pointer"
                            onClick={() => {
                              formik.setFieldValue("quick_comment", option.value);
                              toggleDropdown('quickComment');
                            }}
                          >
                            {option.value}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
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

                      className="w-full text-left mt-1 text-[#666] placeholder-[#666] text-xs font-medium  font-family text-md border flex justify-between items-center border-[#E8E8E8] px-2 py-1.5 rounded-xs"
                    />
                  </div>
                </div>


                <div className="">
                  <div className="relative w-full">
                    <label className="text-xs text-gray-500 font-family font-medium">Lead Created By</label>
                    <button
                      type="button"
                      className="w-full text-left px-2 mt-1 text-[#666] placeholder-[#666] text-[12px] font-medium  font-family text-md border flex justify-between items-center border-[#E8E8E8] py-1.5 rounded-xs bg-white focus:outline-none"
                      onClick={() => toggleDropdown('lead_created_by')}
                    >
                      {formik.values.lead_created_by || "Select"}
                      <FiChevronDown
                        className={`text-lg transition-transform duration-300 ${dropdownStates.lead_created_by ? "rotate-180" : "rotate-0"}`}
                      />
                    </button>
                    {dropdownStates.lead_created_by && (
                      <ul className="absolute w-full bg-white border z-10 border-gray-300 rounded-md shadow-md mt-1">
                        {createdbyValues.map((option, index) => (
                          <li
                            key={index}
                            className="px-3 py-2 text-darkGray font-family hover:bg-gray-100 text-xs cursor-pointer"
                            onClick={() => {
                              formik.setFieldValue("lead_created_by", option.value);
                              toggleDropdown('lead_created_by');
                            }}
                          >
                            {option.value}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

      </form>
    </>
  )
}

export default ViewDetailsLeads;
