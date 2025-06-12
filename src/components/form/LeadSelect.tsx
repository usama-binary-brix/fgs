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
        <label className="text-sm text-gray-500">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      
        className="w-full h-8 p-1  border border-gray-300  text-[#666666] text-xs"
      >
        <option value="" className="text-gray-400 text-xs">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-xs">
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


// 
// import React from "react";
// import { useField } from "formik";

// interface Option {
//   value: string;
//   label: string;
// }

// interface SelectProps {
//   name: string;
//   options: Option[];
//   placeholder?: string;
//   className?: string;
// }

// const Select: React.FC<SelectProps> = ({ name, options, placeholder = "Select an option", className = "" }) => {
//   const [field, meta, helpers] = useField(name);

//   return (
//     <div>
//       <select
//         {...field}
//         className={`h-10 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2 pr-11 text-sm shadow-theme-xs 
//           placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 
//           dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800
//           ${field.value ? "text-gray-800 dark:text-white/90" : "text-gray-400 dark:text-gray-400"} 
//           ${className} ${meta.touched && meta.error ? "border-red-500" : ""}`}
//         onChange={(e) => helpers.setValue(e.target.value)} 
//         onBlur={() => helpers.setTouched(true)}
//       >
//         <option value="" disabled className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
//           {placeholder}
//         </option>
//         {options.map((option) => (
//           <option key={option.value} value={option.value} className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
//             {option.label}
//           </option>
//         ))}
//       </select>
      
//       {/* Display Error Message */}
//       {meta.touched && meta.error && <div className="text-red-500 text-xs mt-1">{meta.error}</div>}
//     </div>
//   );
// };

// export default Select;


// import React, { useState } from "react";

// interface Option {
//   value: string;
//   label: string;
// }

// interface SelectProps {
//   options: Option[];
//   placeholder?: string;
//   onChange: (value: string) => void;
//   className?: string;
//   defaultValue?: string;
// }

// const Select: React.FC<SelectProps> = ({
//   options,
//   placeholder = "Select an option",
//   onChange,
//   className = "",
//   defaultValue = "",
// }) => {
//   // Manage the selected value
//   const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

//   const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     setSelectedValue(value);
//     onChange(value); // Trigger parent handler
//   };

//   return (
//     <select
//       className={`h-10 w-full appearance-none rounded-lg border border-gray-300  px-4 py-2 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
//         selectedValue
//           ? "text-gray-800 dark:text-white/90"
//           : "text-gray-400 dark:text-gray-400"
//       } ${className}`}
//       value={selectedValue}
//       onChange={handleChange}
//     >
//       {/* Placeholder option */}
//       <option
//         value=""
//         disabled
//         className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
//       >
//         {placeholder}
//       </option>
//       {/* Map over options */}
//       {options.map((option) => (
//         <option
//           key={option.value}
//           value={option.value}
//           className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
//         >
//           {option.label}
//         </option>
//       ))}
//     </select>
//   );
// };

// export default Select;
