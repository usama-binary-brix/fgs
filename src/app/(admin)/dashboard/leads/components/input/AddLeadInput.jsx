import React from "react";

const AddLeadInput = ({ label, type = "text", isRequired = false, placeholder = "---", value, onChange, onBlur , name, ...props }) => {
  return (
    <div className="w-full">
      <label className="text-[11.5px] text-[#818181] font-normal font-family" htmlFor={label}>
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
        className="w-full  px-2 py-1 text-[#666] placeholder-[#666] text-[12px] font-medium rounded-xs border border-[#E8E8E8] mt-1 outline-none text-md"
        {...props}

       
      />
    </div>
  );
};

export default AddLeadInput;
