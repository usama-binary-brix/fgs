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
  disabled?:any
}

const Select: React.FC<SelectProps> = ({
  label,
  name,
  value,
  options,
  onChange,
  onBlur,
  error,
  required,
  disabled
}) => {
  return (
    <div>
      {label && (
        <label className="text-sm text-gray-500">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`w-full h-9 p-2 border border-gray-300 rounded-sm text-sm ${value ? 'text-gray-800' : 'text-gray-500'}`}
      >
        <option value="" className="text-gray-400 text-sm">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-gray-800 text-sm">
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

export default Select;
