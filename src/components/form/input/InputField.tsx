import React, { FC } from "react";

interface InputProps {
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  id?: string;
  name?: string;
  value?: any;
  placeholder?: string;
  defaultValue?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void; // <-- Added onBlur
  className?: string;
  min?: string;
  max?: string;
  step?: number;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: any;
  maxLength?:any;
  autoComplete?: any; // <-- Add this line
}

const Input: FC<InputProps> = ({
  type = "text",
  id,
  name,
  placeholder,
  defaultValue,
  onChange,
  onBlur, // <-- Added onBlur
  className = "",
  min,
  value,
  max,
  step,
  disabled = false,
  success = false,
  error = false,
  hint,
  maxLength,
  autoComplete = "off", // <-- Add this line
}) => {
  let inputClasses = `h-9 w-full rounded-sm border appearance-none px-4 py-1 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`;

  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    inputClasses += ` text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10 dark:text-error-400 dark:border-error-500`;
  } else if (success) {
    inputClasses += ` text-success-500 border-success-400 focus:ring-success-500/10 focus:border-success-300 dark:text-success-400 dark:border-success-500`;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`;
  }

  return (
    <div className="relative" >
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onChange}
        onBlur={onBlur} // <-- Added onBlur
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={inputClasses}
        value={value}
        maxLength={maxLength}
        autoComplete={autoComplete} // <-- Change this line
        onKeyDown={(e:any) => {
          if (e.key === '-') {
              e.preventDefault();
          }
      }}
      />
      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error ? "text-error-500" : success ? "text-success-500" : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;




// 
// import React, { FC } from "react";

// interface InputProps {
//   type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
//   id?: string;
//   name?: string;
//   value?:string;
//   placeholder?: string;
//   defaultValue?: string | number;
//   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   className?: string;
//   min?: string;
//   max?: string;
//   step?: number;
//   disabled?: boolean;
//   success?: boolean;
//   error?: boolean;
//   hint?: string; // Optional hint text
// }

// const Input: FC<InputProps> = ({
//   type = "text",
//   id,
//   name,
//   placeholder,
//   defaultValue,
//   onChange,
//   className = "",
//   min,
//   value,
//   max,
//   step,
//   disabled = false,
//   success = false,
//   error = false,
//   hint,
// }) => {
//   // Determine input styles based on state (disabled, success, error)
//   let inputClasses = `h-10 w-full rounded-sm border appearance-none px-4 py-1 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-0 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`;

//   // Add styles for the different states
//   if (disabled) {
//     inputClasses += ` text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
//   } else if (error) {
//     inputClasses += ` text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10  dark:text-error-400 dark:border-error-500`;
//   } else if (success) {
//     inputClasses += ` text-success-500 border-success-400 focus:ring-success-500/10 focus:border-success-300  dark:text-success-400 dark:border-success-500`;
//   } else {
//     inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`;
//   }

//   return (
//     <div className="relative">
//       <input
//         type={type}
//         id={id}
//         name={name}
//         placeholder={placeholder}
//         defaultValue={defaultValue}
//         onChange={onChange}
//         min={min}
//         max={max}
//         step={step}
//         disabled={disabled}
//         className={inputClasses}
//         value={value}
//       />

//       {/* Optional Hint Text */}
//       {hint && (
//         <p
//           className={`mt-1.5 text-xs ${
//             error
//               ? "text-error-500"
//               : success
//               ? "text-success-500"
//               : "text-gray-500"
//           }`}
//         >
//           {hint}
//         </p>
//       )}
//     </div>
//   );
// };

// export default Input;
