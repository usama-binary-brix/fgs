import React from "react";
import { getPasswordStrength } from "@/lib/validation";

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
}) => {
  if (!password) return null;

  const { strength, score, feedback } = getPasswordStrength(password);

  const getStrengthColor = () => {
    switch (strength) {
      case "weak":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "strong":
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  const getStrengthText = () => {
    switch (strength) {
      case "weak":
        return "Weak";
      case "medium":
        return "Medium";
      case "strong":
        return "Strong";
      default:
        return "";
    }
  };

  return (
  <>
  
  </>
  );
};

export default PasswordStrengthIndicator; 