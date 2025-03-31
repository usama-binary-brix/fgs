import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  size?: "sm" | "md";
  variant?: "primary" | "outline" | "fgsoutline" | "outlined";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset"; 
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  type = "button", 
}) => {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm font-medium",
    md: "px-5 py-2.5 text-sm",
  };

  const variantClasses = {
    primary:
      "bg-primary text-white shadow-theme-xs hover:bg-primary/90 disabled:bg-brand-300",
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
    fgsoutline:
      "bg-[#8080801A] text-gray-500 ring-0 ring-inset ring-gray-300 hover:bg-[#808080]/20 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
      outlined: "border border-orange-500 text-primary bg-primary/10 hover:bg-orange-50",
  };

  return (
    <button
      type={type} // ✅ Assign type
      className={`inline-flex items-center justify-center font-medium gap-2 rounded-sm transition ${className} ${sizeClasses[size]
        } ${variantClasses[variant]} ${disabled ? "cursor-not-allowed opacity-50" : ""
        }`}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;

// import React, { ReactNode } from "react";

// interface ButtonProps {
//   children: ReactNode; // Button text or content
//   size?: "sm" | "md"; // Button size
//   variant?: "primary" | "outline"; // Button variant
//   startIcon?: ReactNode; // Icon before the text
//   endIcon?: ReactNode; // Icon after the text
//   onClick?: () => void; // Click handler
//   disabled?: boolean; // Disabled state
//   className?: string; // Disabled state
// }

// const Button: React.FC<ButtonProps> = ({
//   children,
//   size = "md",
//   variant = "primary",
//   startIcon,
//   endIcon,
//   onClick,
//   className = "",
//   disabled = false,
// }) => {
//   // Size Classes
//   const sizeClasses = {
//     sm: "px-4 py-3 text-sm",
//     md: "px-5 py-2.5 text-sm",
//   };

//   // Variant Classes
//   const variantClasses = {
//     primary:
//       "bg-primary text-white shadow-theme-xs hover:bg-primary disabled:bg-brand-300",
//     outline:
//       "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
//   };

//   return (
//     <button
//       className={`inline-flex items-center justify-center font-medium gap-2 rounded-sm transition ${className} ${
//         sizeClasses[size]
//       } ${variantClasses[variant]} ${
//         disabled ? "cursor-not-allowed opacity-50" : ""
//       }`}
//       onClick={onClick}
//       disabled={disabled}
//     >
//       {startIcon && <span className="flex items-center">{startIcon}</span>}
//       {children}
//       {endIcon && <span className="flex items-center">{endIcon}</span>}
//     </button>
//   );
// };

// export default Button;
