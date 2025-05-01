"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <div className="h-[350px] w-full flex items-center justify-center">Loading chart...</div>,
});

interface ApiResponse {
  selling_price: string;
  monthly_price_change: {
    [month: string]: string;
  };
}

export default function MonthlySalesChart(data: any) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<{
    options: ApexOptions;
    series: any[];
    sellingPrice: string;
  } | null>(null);

  useEffect(() => {
    try {
      if (!data?.data) {
        setIsLoading(true);
        return;
      }

      const apiResponse: ApiResponse = {
        selling_price: data?.data?.selling_price || "0",
        monthly_price_change: data?.data?.monthly_price_change || {},
      };

      if (Object.keys(apiResponse.monthly_price_change).length > 0) {
        const monthlyData = Object.values(apiResponse.monthly_price_change).map((value) => {
          return parseFloat(value.replace('%', '')) || 0;
        });

        const displayData = monthlyData.map(value => Math.abs(value));
        const customColors = monthlyData.map(value => {
          const num = Number(value);
          return num < 0 ? '#FF0000' : num > 0 ? '#FFBB6A' : '#FFBB6A';
        });

        const targetData = Array(12).fill(100);

        const months = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const options: ApexOptions = {
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
          states: {
            hover: {
              filter: {
                type: 'none',
              }
            }
          },
          dataLabels: {
            enabled: false,
          },
          xaxis: {
            categories: months,
            axisBorder: { show: false },
            axisTicks: { show: false },
          },
          yaxis: {
            show: false,
            max: 100,
            min: 0
          },
          grid: {
            show: false,
          },
          legend: {
            show: false,
          },
          tooltip: {
            enabled: true,
            style: {
              fontFamily: 'Outfit, sans-serif',
              fontSize: '12px',
            },
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
              const value = monthlyData[dataPointIndex];
              const month = months[dataPointIndex];
              return `
                <div class="apexcharts-tooltip-custom">
                  <div class="title">${month}</div>
                  <div class="content">${value}%</div>
                </div>
              `;
            },
          },
          fill: {
            opacity: 1,
          },
          colors: customColors
        };

        const series = [
          {
            name: "Monthly Change",
            data: displayData,
          },
          {
            name: "Target",
            data: targetData,
            color: '#FFEED9',
          },
        ];

        setChartData({
          options,
          series,
          sellingPrice: apiResponse.selling_price,
        });
        setIsLoading(false);
        setError(null);
      } else {
        setError("No monthly data available");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Failed to process chart data");
      setIsLoading(false);
      console.error(err);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="py-6 flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Revenue Summary
          </h3>
          <h4 className="mt-2 font-bold text-gray-800 text-[34px] dark:text-white/90">
            $0
          </h4>
        </div>
        <div className="h-[350px] flex items-center justify-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Revenue Summary
        </h3>
        <h4 className="mt-2 font-bold text-gray-800 text-[34px] dark:text-white/90">
          $ {chartData?.sellingPrice || "0"}
        </h4>
      </div>

      <style jsx global>{`
        .apexcharts-tooltip-custom {
          display:flex;
          gap:5px;
          text-align: center;
        }
        .apexcharts-tooltip-custom .title {
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 2px;
        }
        .apexcharts-tooltip-custom .content {
          color: #4a5568;
        }
      `}</style>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          {chartData ? (
            <ReactApexChart
              options={chartData.options}
              series={chartData.series}
              type="bar"
              height={350}
            />
          ) : (
            <div className="h-[350px] flex items-center justify-center">
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}