'use client'
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik';
import AddLeadInput from '../../components/input/AddLeadInput';
import { useEditLeadMutation, useGetLeadByIdQuery, usePromoteToInvestorMutation } from '@/store/services/api';
import { toast } from 'react-toastify';
import { FiCalendar, FiChevronDown } from 'react-icons/fi';
import RadioButton from '../../components/radiobutton/RadioButton';

const ViewDetailsLeads = () => {
  const { id } = useParams();
  const { data: leadData, error, isLoading } = useGetLeadByIdQuery(id);
  const [isEditing, setIsEditing] = useState(false);
  const [editLead] = useEditLeadMutation()
  const [dropdownStates, setDropdownStates] = useState({
    calls: false,
    source: false,
    engine: false,
    quickComment: false
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
      hot_lead: '',
      in_finance: '',
      sourcing: '',
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
      const updatedValues = {
        ...values,
        id: Number(id),
        hot_lead: values.hot_lead === "yes",
        in_finance: values.in_finance === "yes",
        sourcing: values.sourcing === "yes",
        reminder_date_time: values.reminder_date_time
          ? new Date(values.reminder_date_time).toISOString().replace("T", " ").split(".")[0]
          : null,
      };
      try {
        const response = await editLead(updatedValues).unwrap();
        toast.success(response.message);
      } catch (error) {
        toast.error("Failed to add lead.");
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
        reminder_date_time: backendDate
          ? new Date(backendDate.getFullYear(), backendDate.getMonth(), backendDate.getDate())
          : null,
        reminder_time: backendDate
          ? new Date(backendDate.setSeconds(0, 0))
          : null,
        hot_lead: leadData.lead.hot_lead === 1 ? "yes" : "no",
        in_finance: leadData.lead.in_finance === 1 ? "yes" : "no",
        sourcing: leadData.lead.sourcing === 1 ? "yes" : "no",

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
    }
  }, [leadData?.lead]);
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
      toast.error("Failed to promote investor.");
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


  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">I-{id}</h1>
        <div className="flex gap-2">
          <button
            className="bg-primary text-white px-4 py-2 rounded-md"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
          <button className="bg-primary text-white px-4 py-2 rounded-md"
            onClick={() => handlePromoteClick(id)}
          >
            Promote to Investor
          </button>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 gap-4">
          <div className="bg-white w-full p-3">
            <h1 className="text-black font-medium mb-2">Contact Information</h1>
            <AddLeadInput label="Name" name="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={!isEditing} />
            <AddLeadInput label="Title" name="title" value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={!isEditing} />
            <AddLeadInput label="Company" name="company" value={formik.values.company} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={!isEditing} />
            <AddLeadInput label="Phone" name="phone" value={formik.values.phone} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={!isEditing} />
            <AddLeadInput label="Email" name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={!isEditing} />
            <AddLeadInput label="Street Address" name="street_address" value={formik.values.street_address} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={!isEditing} />
            <AddLeadInput label="City" name="city" value={formik.values.city} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={!isEditing} />
            <AddLeadInput label="State" name="state" value={formik.values.state} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={!isEditing} />
            <AddLeadInput label="Zip Code" name="zip_code" value={formik.values.zip_code} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={!isEditing} />
          </div>

          <div className="w-full bg-white p-3 h-[400px]">
            <h1 className="text-black font-medium mb-2">Lead Details</h1>

            <div className="relative w-full mb-2">
              <label className="text-xs text-gray-500 font-family font-medium">Number of Calls</label>
              <button
                type="button"
                className="w-full text-left mt-1 text-darkGray font-family text-md border flex justify-between items-center border-gray-300 px-3 py-1 rounded bg-white focus:outline-none"
                onClick={() => toggleDropdown('calls')}
              >
                {matchedOption?.label || "Select an option"}
                <FiChevronDown
                  className={`text-lg transition-transform duration-300 ${dropdownStates.calls ? "rotate-180" : "rotate-0"}`}
                />
              </button>
              {dropdownStates.calls && (
                <ul className="absolute w-full bg-white border z-10 border-gray-300 rounded-md shadow-md mt-1">
                  {options.map((option, index) => (
                    <li
                      key={index}
                      className="px-3 py-2 text-darkGray font-family hover:bg-text hover:text-yellow text-sm cursor-pointer"
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
            </div>
            {/* Lead Source Dropdown */}
            <div className="relative w-full mb-2">
              <label className="text-xs text-gray-500 font-family">Lead Source</label>
              <button
                type="button"
                className="w-full text-left mt-1 text-darkGray text-md border flex justify-between items-center border-gray-300 px-3 py-1 rounded bg-white focus:outline-none"
                onClick={() => toggleDropdown("source")}
              >
                {formik.values.lead_source || "Select a source"}
                <FiChevronDown
                  className={`text-lg transition-transform duration-300 ${dropdownStates.source ? "rotate-180" : "rotate-0"
                    }`}
                />
              </button>
              {dropdownStates.source && (
                <ul className="absolute w-full bg-white border z-10 border-gray-300 rounded-md shadow-md mt-1">
                  {leadSourceOptions.map((option, index) => (
                    <li
                      key={index}
                      className="px-3 py-2 text-darkGray hover:bg-gray-100 text-md cursor-pointer"
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
            <div className="mb-2">
              <AddLeadInput
                name="reminder"
                value={formik.values.reminder}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Reminder"
                disabled={!isEditing}
              />

            </div>

            {/* <div className="mb-2">
              <label className="text-xs text-gray-500 font-family font-medium">Reminder Date & Time</label>
              <div className="flex justify-between items-center gap-2 mt-1">


                <div className="relative w-full">
                  <DatePicker
                    selected={formik.values.reminder_date_time ? new Date(formik.values.reminder_date_time) : undefined}
                    onChange={(date: Date | null) => formik.setFieldValue("reminder_date_time", date)}
                    dateFormat="dd/MM/yyyy"
                    className="w-full px-3 py-1 cursor-pointer text-sm pr-10 border border-gray-300 rounded"
                    placeholderText="dd/mm/yy"
                  />

                  <FiCalendar className="absolute right-2 top-2 text-gray-500 cursor-pointer" />
                  {formik.touched.reminder_date_time && formik.errors.reminder_date_time && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.reminder_date_time}</p>
                  )}
                </div>

                <div className="relative w-full">
                  <DatePicker
                    selected={selectedTime}
                    onChange={(time) => {
                      setSelectedTime(time);
                      formik.setFieldValue("reminder_time", time);
                    }}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeFormat="h:mm aa"
                    dateFormat="h:mm aa"
                    placeholderText="0:00 AM"
                    className="w-full px-3 py-1 border text-sm border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onCalendarOpen={() => setIsIconRotate(true)}
                    onCalendarClose={() => setIsIconRotate(false)}
                  />
                  <FiChevronDown
                    className={`absolute right-2 top-2 text-gray-500 cursor-pointer transition-transform duration-300 ${isIconRotate ? "rotate-180" : "rotate-0"
                      }`}
                  />
                </div>

              </div>
            </div> */}
            <div className="flex gap-5 items-center">
              <div className="flex justify-between gap-5 items-center">
                <div>
                  <ul className="">
                    <li className="text-gray-400 text-sm font-family">Hot Lead</li>
                    <li className="text-gray-400 text-sm font-family">In Finance</li>
                    <li className="text-gray-400 text-sm font-family">Sourcing</li>
                  </ul>
                </div>
                <div>
                  <div className="flex gap-1 items-center">
                    <RadioButton
                      isSelected={formik.values.hot_lead === "yes"}
                      onSelect={() => formik.setFieldValue("hot_lead", "yes")}
                    />
                    <label className="text-darkGray text-sm font-family">Yes</label>
                  </div>
                  <div className="flex gap-1 items-center">
                    <RadioButton
                      isSelected={formik.values.in_finance === "yes"}
                      onSelect={() => formik.setFieldValue("in_finance", "yes")}
                    />
                    <label className="text-darkGray text-sm font-family">Yes</label>
                  </div>
                  <div className="flex gap-1 items-center">
                    <RadioButton
                      isSelected={formik.values.sourcing === "yes"}
                      onSelect={() => formik.setFieldValue("sourcing", "yes")}
                    />
                    <label className="text-darkGray text-sm font-family">Yes</label>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex gap-1 items-center">
                  <RadioButton
                    isSelected={formik.values.hot_lead === "no"}
                    onSelect={() => formik.setFieldValue("hot_lead", "no")}
                  />
                  <label className="text-darkGray text-sm font-family">No</label>
                </div>
                <div className="flex gap-1 items-center">
                  <RadioButton
                    isSelected={formik.values.in_finance === "no"}
                    onSelect={() => formik.setFieldValue("in_finance", "no")}
                  />
                  <label className="text-darkGray text-sm font-family">No</label>
                </div>
                <div className="flex gap-1 items-center">
                  <RadioButton
                    isSelected={formik.values.sourcing === "no"}
                    onSelect={() => formik.setFieldValue("sourcing", "no")}
                  />
                  <label className="text-darkGray text-sm font-family">No</label>
                </div>
              </div>
            </div>




          </div>
          <div>
            <div className="mb-5 bg-white w-full p-3 h-[400px]">
              <h1 className="text-black font-medium font-family mb-2">Equipment Requirements</h1>
              <div className="mb-2">
                <AddLeadInput
                  name="lift_type"
                  value={formik.values.lift_type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Lift Type"
                />
                {formik.touched.lift_type && formik.errors.lift_type && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.lift_type}</p>
                )}
              </div>
              <div className="mb-2">
                <div className="relative w-full mb-2">
                  <label className="text-xs text-gray-500 font-family font-medium">Engine Type</label>
                  <button
                    type="button"
                    className="w-full text-left mt-1 text-darkGray text-md border font-family flex justify-between items-center border-gray-300 px-3 py-1 rounded bg-white focus:outline-none"
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
                          className="px-3 py-2 text-darkGray font-family hover:bg-gray-100 text-md cursor-pointer"
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
              <div className="mb-2">
                <AddLeadInput
                  name="location_used"
                  value={formik.values.location_used}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Location Used"
                />
                {formik.touched.location_used && formik.errors.location_used && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.location_used}</p>
                )}
              </div>
              <div className="mb-2">
                <AddLeadInput
                  name="max_capacity"
                  value={formik.values.max_capacity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Max Capacity"
                  type="number"
                />
                {formik.touched.max_capacity && formik.errors.max_capacity && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.max_capacity}</p>
                )}
              </div>
              <div className="mb-2">
                <label className="text-customGray font-family font-mediumtext-sm">Condition</label>
                <div className="flex gap-4 items-center">
                  <p className="flex gap-2">
                    <RadioButton
                      isSelected={formik.values.condition === "New"}
                      onSelect={() => formik.setFieldValue("condition", "New")}
                    />
                    <label className="text-darkGray text-sm font-family">New</label>
                  </p>
                  <p className="flex gap-2">
                    <RadioButton
                      isSelected={formik.values.condition === "Used"}
                      onSelect={() => formik.setFieldValue("condition", "Used")}
                    />
                    <label className="text-darkGray text-sm font-family">Used</label>
                  </p>
                  <p className="flex gap-2">
                    <RadioButton
                      isSelected={formik.values.condition === "New/Used"}
                      onSelect={() => formik.setFieldValue("condition", "New/Used")}
                    />
                    <label className="text-darkGray text-sm font-family">New/Used</label>
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
              <div className="mb-2">
                <label className="text-xs text-gray-500 font-family font-medium">Budget</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="number"
                    name="budget_min"
                    value={formik.values.budget_min}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="$ 0.00"
                    className="w-full px-2 py-1 rounded-sm border border-gray-300 mt-1 outline-none text-md"
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
                    className="w-full px-2 py-1 rounded-sm border border-gray-300 mt-1 outline-none text-md"
                  />
                  {formik.touched.budget_max && formik.errors.budget_max && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.budget_max}</p>
                  )}
                </div>
              </div>
              <div className="mb-2">
                <AddLeadInput
                  name="financing"
                  value={formik.values.financing}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Financing"
                />
                {formik.touched.financing && formik.errors.financing && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.financing}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white p-3 w-full mb-5">
              <h1 className="text-black font-medium font-family mb-2">Purchase Timeline</h1>
              <div className="flex gap-7">
                <div>
                  <ul className="">
                    <li className="flex gap-2 items-center font-family pb-1">
                      <RadioButton
                        isSelected={formik.values.purchase_timeline === "ASAP"}
                        onSelect={() => formik.setFieldValue("purchase_timeline", "ASAP")}
                      />
                      <label className="text-sm text-darkGray font-medium font-family">ASAP</label>
                    </li>
                    <li className="flex gap-2 items-center pb-1 font-family">
                      <RadioButton
                        isSelected={formik.values.purchase_timeline === "In 1 Month"}
                        onSelect={() => formik.setFieldValue("purchase_timeline", "In 1 Month")}
                      />
                      <label className="text-sm text-darkGray font-medium font-family">In 1 Month</label>
                    </li>
                    <li className="flex gap-2 items-center">
                      <RadioButton
                        isSelected={formik.values.purchase_timeline === "3+ Months"}
                        onSelect={() => formik.setFieldValue("purchase_timeline", "3+ Months")}
                      />
                      <label className="text-sm text-darkGray font-medium font-family">3+ Months</label>
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
                      <label className="text-sm text-darkGray pb-1 font-medium font-family">In 2 Months</label>
                    </li>
                    <li className="flex gap-2 items-center font-family">
                      <RadioButton
                        isSelected={formik.values.purchase_timeline === "More than 2 Months"}
                        onSelect={() => formik.setFieldValue("purchase_timeline", "More than 2 Months")}
                      />
                      <label className="text-sm text-darkGray font-medium font-family">More than 2 Months</label>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 w-full">
              <h1 className="text-black font-medium mb-2 font-family">Additional Information</h1>
              <div className="mb-2">
                <div className="relative w-full mb-2">
                  <label className="text-xs text-gray-500 font-family font-medium">Quick Comment</label>
                  <button
                    type="button"
                    className="w-full text-left mt-1 font-family text-darkGray text-md border flex justify-between items-center border-gray-300 px-3 py-1 rounded bg-white focus:outline-none"
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
                          className="px-3 py-2 text-darkGray font-family hover:bg-gray-100 text-md cursor-pointer"
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
              <div className="mb-2">
                <div className="flex flex-col">
                  <label className="font-medium font-family text-xs text-gray-500">Comments</label>
                  <textarea
                    name="comments"
                    value={formik.values.comments}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1 border-1 border-gray-300 rounded"
                  />
                </div>
              </div>
              <div className="mb-2">
                <label className="text-xs font-family text-gray-500 font-medium">Select Your Name</label>
                <div className="flex items-center gap-5 mt-1">
                  <div className="flex items-center gap-2">
                    <RadioButton
                      isSelected={formik.values.lead_created_by === "Arcangelo"}
                      onSelect={() => formik.setFieldValue("lead_created_by", "Arcangelo")}
                    />
                    <label className="text-sm font-family text-darkGray font-medium">Arcangelo</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioButton
                      isSelected={formik.values.lead_created_by === "Myron"}
                      onSelect={() => formik.setFieldValue("lead_created_by", "Myron")}
                    />
                    <label className="text-sm font-family text-darkGray font-medium">Myron</label>
                  </div>
                </div>
                {formik.touched.lead_created_by && formik.errors.lead_created_by && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.lead_created_by}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        {isEditing && (
          <button type="submit" className="bg-primary text-white px-4 py-2 mt-4 rounded-md">
            Update
          </button>
        )}
      </form>
    </>
  )
}

export default ViewDetailsLeads;
