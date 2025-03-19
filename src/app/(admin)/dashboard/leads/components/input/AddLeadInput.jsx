import React from "react";

const AddLeadInput = ({ label, type = "text", placeholder = "---", ...props }) => {
  return (
    <div className="w-full">
      <label className="text-xs text-customGray font-normal" htmlFor={label}>
        {label}
      {console.log(label)}
      </label>
      <input
        id={label}
        type={type}
        placeholder={placeholder}
        className="w-full  px-2 py-1 text-darkGray rounded-sm border border-gray-300 mt-1 outline-none text-md"
        {...props}

       
      />
    </div>
  );
};

export default AddLeadInput;
