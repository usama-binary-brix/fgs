"use client";
import React from "react";
import { MdInfoOutline } from "react-icons/md";

export const AdminMatrics = (data?: any) => {
  const metricsData = [
    {
      title: "Total Investors",
      value: data?.data?.total_investors || "0",
      tooltip: "Number of investors in the FGS",
      icon: <MdInfoOutline className="text-gray-400 text-xl"/>,
      },
    {
      title: "Total Employees",
      value: data?.data?.total_employees || "0",
      tooltip: "Number of employees in the FGS",
      icon: <MdInfoOutline className="text-gray-400 text-xl"/>,
    },
    {
      title: "Total Investments",
      value: data?.data?.total_investments ? `$${data?.data?.total_investments}` : "$0.00",
      tooltip: "Total amount invested across all projects",
      icon: <MdInfoOutline className="text-gray-400 text-xl"/>,
    },
    {
      title: "Total Projects",
      value: data?.data?.total_projects || "0",
      tooltip: "Number of active projects",
      icon: <MdInfoOutline className="text-gray-400 text-xl"/>,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-3">
      {metricsData.map((item, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-medium text-black dark:text-gray-400">
              {item.title}
            </span>
            <div className="relative group">
              {item.icon}
              <div className="absolute z-10 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap">
                {item.tooltip}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-0 border-t-4 border-t-gray-800 border-l-transparent border-r-transparent"></div>
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between mt-2">
            <div>
              <h4 className="mt-2 font-bold text-[#1B281B] text-[34px] dark:text-white/90">
                {item.value}
              </h4>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};