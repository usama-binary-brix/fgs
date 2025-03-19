"use client";

import TopButtons from "@/components/Buttons/TopButtons";
import AddLeadInput from "../components/input/AddLeadInput"
import { useState } from "react";
import { FiChevronDown, FiCalendar } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import RadioButton from '../components/radiobutton/RadioButton'



const AddNewLead = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Select");
  const [isOpenSource, setIsOpenSource] = useState(false);
  const [selectedSourceOption, setSelectedSourceOption] = useState("Select");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isIconRotate, setisIconRotate] = useState(false);
  const [isOpenEngine, setIsOpenEngine] = useState(false);
  const [isEngineValues, setIsEngineValues] = useState("Select");
  const [isOpenQuick, setIsOpenQuick] = useState(false);
  const [isQuickValues, setIsQuickValues] = useState("Select");
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [purchaseSelected, setPurchaseSelected] = useState(null);
  const [selectName, setSelectName] = useState(null);

  const [RadioButtonValue, setRadioButtonValue] = useState({
    Lead: null,
    finance: null,
    sourcing: null,
  });

  const options = [
    { label: "No Calls - Balck", value: "red" },
    { label: "1st Call - Red", value: "blue" },
    { label: "2nd Call - Purple", value: "purple" },
    { label: "3rd Call - Green", value: "blue" },
    { label: "4rd Call - Blue", value: "blue" },
    { label: "5rd Call - Cyan", value: "blue" },
  ];

  // lead source dropdown values


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

  // engine dropdown values 

  const engineOptions = [
    { value: "Liquid propane Gas (LPG)" },
    { value: "Diesel" },
    { value: "Gasoline" },
    { value: "Dual fuel (Gas/LPG)" },
    { value: "Electric" },
    { value: "Other" },
    { value: "Not sure" },

  ];

  // quick comment dropdown

  const quickCommentValues = [
    { value: "Left a Message" },
    { value: "Talked to Customer" },
    { value: "Customer Already Bought a List" },


  ];




  const handleSelect = (option) => {
    setSelectedOption(option.label);
    setIsOpen(false);
  };

  // lead source dropdown

  const handleSourceDropdown = (option) => {
    setSelectedSourceOption(option.value);
    setIsOpenSource(false);
  };

  // engine dropdown


  const handleEngineDropdown = (option) => {
    setIsEngineValues(option.value);
    setIsOpenEngine(false);
  };

  // quick comment dropdown


  const handleQuickDropdown = (option) => {
    setIsQuickValues(option.value);
    setIsOpenQuick(false);
  };

  const handleSelectRadioButton = (category, value) => {
    setRadioButtonValue((prev) => ({
      ...prev,
      [category]: value,
    }));
  };


  return (
    <>
      <div className="container-fluid">
        <div className="row mb-10">
          <div className="grid grid-cols-1">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-extrabold text-goldenBlack ">Add New Lead</h1>
              <TopButtons label="Add Lead" />
            </div>

          </div>

        </div>
        <div className="row">
          <div className="grid grid-cols-1  xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 gap-4">
            <div className="bg-white w-full p-3">
              <h1 className="text-black font-medium mb-2">
                Contact Information
              </h1>
              <div className="mb-2">
                <AddLeadInput label="Name" />
              </div>
              <div className="mb-2">
                <AddLeadInput label="Title" />
              </div>
              <div className="mb-2">
                <AddLeadInput label="Company" />
              </div>
              <div className="mb-2">
                <AddLeadInput label="Phone" />
              </div>
              <div className="mb-2">
                <AddLeadInput label="Email" />
              </div>
              <div className="mb-2">
                <AddLeadInput label="Street Adress" />
              </div>
              <div className="mb-2">
                <AddLeadInput label="City" />
              </div>
              <div className="mb-2">
                <AddLeadInput label="Sate" />
              </div>
              <div>
                <AddLeadInput label="Zip Code" type="number" />
              </div>

            </div>
            <div className="w-full bg-white p-3 h-[400px]">
              <h1 className="text-black font-medium mb-2">
                Lead Details
              </h1>

              <div className="relative w-64 mb-2">
                <label className="text-xs text-gray-500  font-medium" htmlFor="">Number of Calls</label>

                <button
                  className="w-full text-left mt-1 text-darkGray text-md border flex justify-between items-center border-gray-300 px-3 py-1 rounded bg-white focus:outline-none"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {selectedOption}
                  <FiChevronDown
                    className={`text-lg transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
                      }`}
                  />
                </button>

                {isOpen && (
                  <ul className="absolute w-full bg-white border z-1 border-gray-300 rounded-md shadow-md mt-1">
                    {options.map((option, index) => (
                      <li
                        key={index}
                        className="px-3 py-2 text-darkGray hover:bg-text hover:text-yellow text-sm cursor-pointer"
                        onClick={() => handleSelect(option)}
                      >
                        {option.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* lead source dropdown */}
              <div className="relative w-64 mb-2">
                <label className="text-xs text-gray-500  font-medium" htmlFor="">Lead Source</label>

                <button
                  className="w-full text-left mt-1 text-darkGray text-md border flex justify-between items-center border-gray-300 px-3 py-1 rounded bg-white focus:outline-none"
                  onClick={() => setIsOpenSource(!isOpenSource)}
                >
                  {selectedSourceOption}
                  <FiChevronDown
                    className={`text-lg transition-transform duration-300 ${isOpenSource ? "rotate-180" : "rotate-0"
                      }`}
                  />
                </button>
                {isOpenSource && (
                  <ul className="absolute w-full bg-white border z-1 border-gray-300 rounded-md shadow-md mt-1">
                    {leadSourceOptions.map((option, index) => (
                      <li
                        key={index}
                        className="px-3 py-2 text-darkGray hover:bg-gray-100 text-md cursor-pointer"
                        onClick={() => handleSourceDropdown(option)}
                      >
                        {option.value}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="mb-2">
                <AddLeadInput
                  label="Reminder"
                />
              </div>

              <div className="mb-2">
                <label className="text-xs text-gray-500  font-medium" htmlFor="">Reminder Date & Time</label>
                <div className="flex justify-between items-center gap-2 mt-1">
                  <div className="relative w-full">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      dateFormat="dd/MM/yyyy"
                      className="w-full px-3 py-1 cursor-pointer text-sm pr-10 border border-gray-300 rounded"
                      placeholderText="dd/mm/yy"
                    />
                    <FiCalendar className="absolute right-2 top-2 text-gray-500 cursor-pointer" />
                  </div>
                  <div className="relative w-full">
                    <DatePicker
                      selected={selectedTime}
                      onChange={(time) => setSelectedTime(time)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeFormat="h:mm aa"
                      dateFormat="h:mm aa"
                      placeholderText="0:00 AM"
                      className="w-full px-3 py-1 border text-sm border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onCalendarOpen={() => setisIconRotate(true)}
                      onCalendarClose={() => setisIconRotate(false)}
                    />
                    <FiChevronDown
                      className={`absolute right-2 top-2 text-gray-500 cursor-pointer transition-transform duration-300 ${isIconRotate ? "rotate-180" : "rotate-0"
                        }`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex  gap-5 items-center">
                <div className="flex justify-between gap-5 items-center">
                  <div>
                    <ul className="">
                      <li className="text-gray-400  text-sm">Hot Lead</li>
                      <li className="text-gray-400  text-sm">In Finance</li>
                      <li className="text-gray-400  text-sm">Sourcing</li>
                    </ul>
                  </div>
                  <div>
                    <div className="flex gap-1 items-center">
                      <RadioButton
                        isSelected={RadioButtonValue.Lead === "yes"}
                        onSelect={() => handleSelectRadioButton("Lead", "yes")}
                      />
                      <label className="text-darkGray  text-sm" htmlFor="">Yes</label>
                    </div>
                    <div className="flex gap-1 items-center">
                      <RadioButton
                        isSelected={RadioButtonValue.finance === "yes"}
                        onSelect={() => handleSelectRadioButton("finance", "yes")}
                      />
                      <label className="text-darkGray  text-sm" htmlFor="">Yes</label>
                    </div>
                    <div className="flex gap-1 items-center">
                      <RadioButton
                        isSelected={RadioButtonValue.sourcing === "yes"}
                        onSelect={() => handleSelectRadioButton("sourcing", "yes")}
                      />
                      <label className="text-darkGray  text-sm" htmlFor="">Yes</label>
                    </div>

                  </div>
                </div>
                <div>
                  <div className="flex gap-1 items-center">
                    <RadioButton
                      isSelected={RadioButtonValue.Lead === "no"}
                      onSelect={() => handleSelectRadioButton("Lead", "no")}
                    />
                    <label className="text-darkGray  text-sm" htmlFor="">No</label>
                  </div>
                  <div className="flex gap-1 items-center">
                    <RadioButton
                      isSelected={RadioButtonValue.finance === "no"}
                      onSelect={() => handleSelectRadioButton("finance", "no")}
                    />
                    <label className="text-darkGray  text-sm" htmlFor="">No</label>
                  </div>
                  <div className="flex gap-1 items-center">
                    <RadioButton
                      isSelected={RadioButtonValue.sourcing === "no"}
                      onSelect={() => handleSelectRadioButton("sourcing", "no")}
                    />
                    <label className="text-darkGray  text-sm" htmlFor="">No</label>
                  </div>
                </div>
              </div>


            </div>
            <div>
              <div className="mb-5 bg-white w-full p-3 h-[400px]">
                <h1 className="text-black font-medium mb-2">
                  Equipment Requirements
                </h1>
                <div className="mb-2">
                  <AddLeadInput
                    label="Lift Type"
                  />
                </div>
                <div className="mb-2">
                  <div className="relative w-64 mb-2">
                    <label className="text-xs text-gray-500  font-medium" htmlFor="">Engine Type</label>

                    <button
                      className="w-full text-left mt-1 text-darkGray text-md border flex justify-between items-center border-gray-300 px-3 py-1 rounded bg-white focus:outline-none"
                      onClick={() => setIsOpenEngine(!isOpenEngine)}
                    >
                      {isEngineValues}
                      <FiChevronDown
                        className={`text-lg transition-transform duration-300 ${isOpenEngine ? "rotate-180" : "rotate-0"
                          }`}
                      />
                    </button>
                    {isOpenEngine && (
                      <ul className="absolute w-full bg-white border z-1 border-gray-300 rounded-md shadow-md mt-1">
                        {engineOptions.map((option, index) => (
                          <li
                            key={index}
                            className="px-3 py-2 text-darkGray hover:bg-gray-100 text-md cursor-pointer"
                            onClick={() => handleEngineDropdown(option)}
                          >
                            {option.value}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                </div>
                <div className="mb-2">
                  <AddLeadInput
                    label="Location Used"
                  />
                </div>
                <div className="mb-2">
                  <AddLeadInput
                    label="Max Capacity"
                  />
                </div>
                <div className="mb-2">
                  <label className="text-customGray font-normal text-sm" htmlFor="">Condition</label>
                  <div className="flex gap-4 items-center">
                    <p className="flex gap-2">
                      <RadioButton
                        isSelected={selectedCondition === "new"}
                        onSelect={() => setSelectedCondition("new")}
                      />
                      <label className="text-darkGray text-sm" htmlFor="">New</label>
                    </p>
                    <p className="flex gap-2">
                      <RadioButton
                        isSelected={selectedCondition === "Used"}
                        onSelect={() => setSelectedCondition("Used")}
                      />
                      <label className="text-darkGray text-sm" htmlFor="">Used</label>
                    </p>
                    <p className="flex gap-2">
                      <RadioButton
                        isSelected={selectedCondition === "New/Used"}
                        onSelect={() => setSelectedCondition("New/Used")}
                      />
                      <label className="text-darkGray text-sm" htmlFor="">New/Used</label>
                    </p>
                  </div>
                </div>

              </div>
              <div className="mb-5 bg-white w-full p-3 ">
                <h1 className="text-black font-medium mb-2">
                  Budget & Financing
                </h1>
                <div className="mb-2">
                  <label className="text-xs text-gray-500  font-medium" htmlFor="">Budget</label>
                  <div className="flex gap-3 items-center">
                    <input type="number" placeholder="$ 0.00" className="w-full   px-2 py-1 rounded-sm border border-gray-300 mt-1 outline-none text-md" />
                    -
                    <input type="number" placeholder="$ 0.00" className="w-full  px-2 py-1 rounded-sm border border-gray-300 mt-1 outline-none text-md" />
                  </div>
                </div>
                <div className="mb-2">
                  <AddLeadInput
                    label="Financing"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white p-3 w-full mb-5">
                <h1 className="text-black font-medium mb-2">
                  Purchase Timeline
                </h1>
                <div className="flex  gap-7">
                  <div>
                    <ul className="">
                      <li className="flex gap-2 items-center pb-1">
                        <RadioButton
                          isSelected={purchaseSelected === "ASAP"}
                          onSelect={() => setPurchaseSelected("ASAP")}
                        />
                        <label className="text-sm text-darkGray font-medium" htmlFor="">ASAP</label>
                      </li>
                      <li className="flex gap-2 items-center pb-1">
                        <RadioButton
                          isSelected={purchaseSelected === "In 1 Month"}
                          onSelect={() => setPurchaseSelected("In 1 Month")}
                        />
                        <label className="text-sm text-darkGray font-medium" htmlFor="">In 1 Month</label>
                      </li>
                      <li className="flex gap-2 items-center">
                        <RadioButton
                          isSelected={purchaseSelected === "3+ Months"}
                          onSelect={() => setPurchaseSelected("3+ Months")}
                        />
                        <label className="text-sm text-darkGray font-medium" htmlFor="">3+ Months</label>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <ul>
                      <li className="flex gap-2 items-center">
                        <RadioButton
                          isSelected={purchaseSelected === "In 2 Months"}
                          onSelect={() => setPurchaseSelected("In 2 Months")}
                        />
                        <label className="text-sm text-darkGray pb-1 font-medium" htmlFor="">In 2 Months</label>
                      </li>
                      <li className="flex gap-2 items-center">
                        <RadioButton
                          isSelected={purchaseSelected === "More than 2 Months"}
                          onSelect={() => setPurchaseSelected("More than 2 Months")}
                        />
                        <label className="text-sm text-darkGray font-medium" htmlFor="">More than 2 Months</label>
                      </li>

                    </ul>
                  </div>
                </div>
              </div>
              <div className="bg-white p-3 w-full">
                <h1 className="text-black font-medium mb-2">
                  Additional Information
                </h1>
                <div className="mb-2">
                  <div className="relative w-64 mb-2">
                    <label className="text-xs text-gray-500  font-medium" htmlFor="">Lead Source</label>

                    <button
                      className="w-full text-left mt-1 text-darkGray text-md border flex justify-between items-center border-gray-300 px-3 py-1 rounded bg-white focus:outline-none"
                      onClick={() => setIsOpenQuick(!isOpenQuick)}
                    >
                      {isQuickValues}
                      <FiChevronDown
                        className={`text-lg transition-transform duration-300 ${isOpenQuick ? "rotate-180" : "rotate-0"
                          }`}
                      />
                    </button>
                    {isOpenQuick && (
                      <ul className="absolute w-full bg-white border z-1 border-gray-300 rounded-md shadow-md mt-1">
                        {quickCommentValues.map((option, index) => (
                          <li
                            key={index}
                            className="px-3 py-2 text-darkGray hover:bg-gray-100 text-md cursor-pointer"
                            onClick={() => handleQuickDropdown(option)}
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
                    <label className="font-medium text-xs text-gray-500" htmlFor="">Comments</label>
                    <textarea name="" className="mt-1 border-1 border-gray-300 rounded" id=""></textarea>
                  </div>
                </div>
                <div className="mb-2">
                  <label className="text-xs text-gray-500 font-medium" htmlFor="">Select Your Name</label>
                  <div className="flex items-center gap-5 mt-1">
                    <div className="flex items-center gap-2">
                      <RadioButton
                        isSelected={selectName === "Arcangelo"}
                        onSelect={() => setSelectName("Arcangelo")}
                      />
                      <label className="text-sm text-darkGray font-medium" htmlFor="">Arcangelo</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioButton
                        isSelected={selectName === "Myron"}
                        onSelect={() => setSelectName("Myron")}
                      />
                      <label className="text-sm text-darkGray font-medium" htmlFor="">Myron</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </>
  )
}


export default AddNewLead;
