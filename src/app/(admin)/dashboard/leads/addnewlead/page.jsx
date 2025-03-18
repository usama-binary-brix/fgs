"use client";

import TopButtons from "@/components/Buttons/TopButtons";
import AddLeadInput from "../components/input/AddLeadInput"
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";


const AddNewLead = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Select an option");

  const options = [
    { label: "No Calls - Red", value: "red" },
    { label: "2nd Call - Purple", value: "purple" },
    { label: "3rd Call - Blue", value: "blue" },
  ];

  const handleSelect = (option) => {
    setSelectedOption(option.label);
    setIsOpen(false); // Close dropdown after selecting
  };
  return (
    <>
      <div className="container">
        <div className="row mb-10">
          <div className="grid grid-cols-1">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-extrabold text-goldenBlack ">Add New Lead</h1>
              <TopButtons label="Add Lead" />
            </div>

          </div>

        </div>
        <div className="row">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white w-full p-3">
              <h1 className="text-black font-bold mb-2">
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
            <div className="w-full bg-white p-3">
              <h1 className="text-black font-bold mb-2">
                Lead Details
              </h1>

              <div className="relative w-64 text-2xl">
                {/* Dropdown Button */}
                <button
                  className="w-full text-left border flex justify-between items-center border-gray-300 px-3 py-2 rounded-md bg-white focus:outline-none"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {selectedOption}
                  <FiChevronDown
          className={`text-lg transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
                </button>

                {/* Dropdown List */}
                {isOpen && (
                  <ul className="absolute w-full bg-white border border-gray-300 rounded-md shadow-md mt-1">
                    {options.map((option, index) => (
                      <li
                        key={index}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelect(option)}
                      >
                        {option.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            

            </div>
            <div className="bg-black w-full"></div>
            <div className="bg-black w-full"></div>
          </div>
        </div>

      </div>

    </>
  )
}


export default AddNewLead;
