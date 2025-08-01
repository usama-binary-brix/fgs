import React from "react";

interface SelectProps {
  label?: string;
  name: string;
  value: string | number;
  options: { value: string; label: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  error?: any;
  required?: boolean;
}

const LeadSelect: React.FC<SelectProps> = ({
  label,
  name,
  value,
  options,
  onChange,
  onBlur,
  error,
  required,
}) => {
  return (
    <div>
      {label && (
        <label className="text-[11.5px] text-[#818181] font-normal font-family">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className="w-full px-2 py-1.5 text-[#666] placeholder-[#666666] text-[12px] font-medium rounded-xs border border-[#E8E8E8] outline-none text-md"
      >
        <option value="" className="text-[#666] text-[12px]">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-[#666] text-[12px]">
            {option.label}
          </option>
        ))}
      </select>
      {error && typeof error === "string" && (
        <p className="text-error-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default LeadSelect;
