"use client";
import React from "react";
import { MdInfoOutline } from "react-icons/md";

export const EcommerceMetrics = () => {
  const metricsData = [
    {
      title: "Customers",
      value: "3,782",
      icon: <MdInfoOutline />,
    },
    {
      title: "Revenue",
      value: "$12,500",
      icon: <MdInfoOutline />,
    },
    {
      title: "Orders",
      value: "2,140",
      icon: <MdInfoOutline />,
    },
    {
      title: "Products",
      value: "458",
      icon: <MdInfoOutline />,
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
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {item.title}
            </span>
            {item.icon}
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {item.value}
              </h4>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
