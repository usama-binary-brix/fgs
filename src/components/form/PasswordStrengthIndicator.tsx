import React from "react";
import { getPasswordStrength } from "@/lib/validation";

interface PasswordStrengthIndicatorProps {
  password: string;
  showIndicator?: boolean;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  showIndicator = true,
}) => {
  if (!password || !showIndicator) return null;

  const { strength, score, feedback } = getPasswordStrength(password);

  const getStrengthColor = () => {
    switch (strength) {
      case "weak":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "strong":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const getStrengthBgColor = () => {
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

  return (
    <>
    
    </>
  );
};

export default PasswordStrengthIndicator; 