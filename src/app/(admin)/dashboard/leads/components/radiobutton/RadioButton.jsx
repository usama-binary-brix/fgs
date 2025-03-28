import React, { useState } from "react";

const RadioButton = ({ isSelected, onSelect }) => {


  return (
    <label className="flex items-center cursor-pointer">
      <input
        type="radio"
        name="option"
        className="hidden"
        checked={isSelected}
        onChange={onSelect}
       
      />
      <div
        className={`w-3 h-3 border-0 border-orange-500  rounded-full flex items-center justify-center transition-all ${
          isSelected ? "bg-[#d18428]" : "bg-[#ECECEC]"
        }`}
      >
        {isSelected && <div className="w-2.5 h-2.5 border-orange-500 border-2 bg-gray-200 rounded-full"></div>}
      </div>
    </label>
  );
};

export default RadioButton;
