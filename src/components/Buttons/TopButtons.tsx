import React from "react";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "outlined" | "secondary" | "success" | "danger";
}

const TopButtons: React.FC<ButtonProps> = ({ label, onClick,  variant = "primary" }) => {
  const baseClass =
    "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition-all duration-200 shadow-sm";

  const variantClass = {
    primary: "bg-primary text-white",
    outlined: "border border-orange-500 text-primary bg-primary/10 hover:bg-orange-50",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    success: "bg-green-600 text-white hover:bg-green-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button onClick={onClick}  className={`${baseClass}  font-family ${variantClass[variant]}`}>
      {label}
    </button>
  );
};

export default TopButtons;
