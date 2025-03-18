"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function ProjectsChart() {
  const options: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    colors: ["#1E90FF", "#FFA500", "#32CD32"], // Custom colors for each series
    stroke: {
      curve: "straight",
      width: 2,
    },
    markers: {
      size: 5,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 7,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      x: {
        format: "dd MMM yyyy",
      },
    },
    xaxis: {
      type: "category",
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
      title: {
        text: "",
        style: {
          fontSize: "0px",
        },
      },
    },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "right",
     
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
  };

  const series = [
    {
      name: "In Progress",
      data: [10, 20, 30, 25, 40, 50, 60],
    },
    {
      name: "On Hold",
      data: [50, 30, 35, 40, 25, 15, 30],
    },
    {
      name: "Sold Projects",
      data: [20, 20, 25, 35, 50, 55, 45],
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-0 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-0 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold pl-4 text-gray-800 dark:text-white/90">
            Projects
          </h3>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-full pr-3">
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={310}
          />
        </div>
      </div>
    </div>
  );
}
