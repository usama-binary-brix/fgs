import React from "react";

const AddLeadInput = ({ label, type = "text", isRequired = false, placeholder = "---", value, onChange, onBlur , name, ...props }) => {
  return (
    <div className="w-full">
      <label className="text-xs text-customGray font-family" htmlFor={label}>
        {label}{isRequired && <span className="text-red-500">*</span>}

      
      </label>
      <input
        id={label}
        type={type}
        placeholder={placeholder}
        value={value}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        className="w-full  px-2 py-1 text-darkGray rounded-sm border border-gray-300 mt-1 outline-none text-md"
        {...props}

       
      />
    </div>
  );
};

export default AddLeadInput;
