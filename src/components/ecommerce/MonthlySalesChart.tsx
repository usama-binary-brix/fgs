"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
export default function MonthlySalesChart() {
const options: ApexOptions = {
  colors: ["#D18428", "#FFEED9"], 
  chart: {
    fontFamily: "Outfit, sans-serif",
    type: "bar",
    height: 200,
    stacked: true,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "40%",
      borderRadius: 4,
      borderRadiusApplication: "end",
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    show: false,
  },
  grid: {
    show: false,
  },
  legend: {
    show: false,
  },
  tooltip: {
    y: {
      formatter: (val: number) => `$${val}`,
    },
  },
  fill: {
    opacity: 1,
  },
};

const series = [
  {
    name: "Revenue",
    data: [200, 150, 200, 100, 180, 240, 230, 200, 160, 220, 100, 240],
  },
  {
    name: "Target",
    data: [250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250],
  },
];

  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        Revenue Summary
        </h3>
        <h4 className="mt-2 font-bold text-gray-800 text-[34px] dark:text-white/90">
          $ 50,000
              </h4>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
}
