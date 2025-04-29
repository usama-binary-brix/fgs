// "use client";
// import dynamic from "next/dynamic";
// import { useState } from "react";
// import { ApexOptions } from "apexcharts";

// const ReactApexChart = dynamic(() => import("react-apexcharts"), {
//   ssr: false,
// });

// interface Investor {
//   id: number;
//   name: string;
//   amount: number;
//   color: string;
// }

// const MonthlyTarget = (data:any) => {
//   console.log(data?.data?.top_investments, '')
//   const investorsData: Investor[] = [
//     { id: 1, name: "John Doe", amount: 50000, color: "#1C64F2" },
//     { id: 2, name: "Jane Smith", amount: 45000, color: "#16BDCA" },
//     { id: 3, name: "Robert Johnson", amount: 40000, color: "#FDBA8C" },
//     { id: 4, name: "Emily Davis", amount: 35000, color: "#E74694" },
//     { id: 5, name: "Michael Brown", amount: 30000, color: "#7E3AF2" },
//     { id: 6, name: "Sarah Wilson", amount: 25000, color: "#FF5A1F" },
//     { id: 7, name: "David Taylor", amount: 20000, color: "#32D583" },
//     { id: 8, name: "Jessica Anderson", amount: 15000, color: "#F05252" },
//     { id: 9, name: "Thomas Thomas", amount: 10000, color: "#9061F9" },
//     { id: 10, name: "Lisa Jackson", amount: 5000, color: "#3F83F8" },
//   ];

//   const totalInvestment = investorsData.reduce(
//     (sum, investor) => sum + investor.amount,
//     0
//   );

//   const getChartOptions = (): ApexOptions => {
//     return {
//       series: investorsData.map((investor) => investor.amount),
//       colors: investorsData.map((investor) => investor.color),
//       chart: {
//         height: 420,
//         width: "100%",
//         type: "donut",
//         animations: {
//           enabled: true,
      
//           speed: 800,
//           animateGradually: {
//             enabled: true,
//             delay: 150
//           },
//           dynamicAnimation: {
//             enabled: true,
//             speed: 350
//           }
//         },
//       },
//       stroke: {
//         colors: ["transparent"],
//         lineCap: "round",
//         width: 0,
//       },
//       plotOptions: {
//         pie: {
//           donut: {
//             labels: {
//               show: true,
//               name: {
//                 show: true,
//                 fontFamily: "Inter, sans-serif",
//                 offsetY: 40,
//               },
//               total: {
//                 showAlways: true,
//                 show: true,
//                 label: "Total Investment",
//                 fontFamily: "Inter, sans-serif",
//                 formatter: () => `$${totalInvestment.toLocaleString()}`,
//               },
//               value: {
//                 show: true,
//                 fontFamily: "Inter, sans-serif",
//                 offsetY: -20,
//                 formatter: (value) => `$${parseInt(value).toLocaleString()}`,
//               },
//             },
//             size: "70%",
//           },
//           customScale: 1,
//           offsetX: 0,
//           offsetY: 0,
//           expandOnClick: true,
//           dataLabels: {
//             offset: 0,
//             minAngleToShowLabel: 10
//           }
//         },
//       },
//       dataLabels: {
//         enabled: false,
//       },
//       legend: {
//         show: false,
//       },
//       tooltip: {
//         enabled: true,
//         fillSeriesColor: false,
//         style: {
//           fontFamily: "Inter, sans-serif",
//         },
//         custom: ({ seriesIndex }) => {
//           const investor = investorsData[seriesIndex];
//           const percentage = ((investor.amount / totalInvestment) * 100).toFixed(1);
          
//           return `
//             <div class="px-3 py-2 bg-white rounded-lg shadow-lg border border-gray-200">
//               <div class="font-semibold text-gray-900">${investor.name}</div>
//               <div class="text-gray-700">Investment: $${investor.amount.toLocaleString()}</div>
   
//             </div>
//           `;
//         },
//       },
//       states: {
//         hover: {
//           filter: {
//             type: 'lighten', // or 'darken'
//                  // brightness value
//           }
//         },
//         active: {
//           filter: {
//             type: 'none',
//           }
//         }
//       },
//       fill: {
//         opacity: 1,
//       },
//       responsive: [
//         {
//           breakpoint: 480,
//           options: {
//             chart: {
//               width: "100%",
//             },
//           },
//         },
//       ],
//     };
//   };

//   const [chartOptions] = useState<ApexOptions>(getChartOptions());
//   const [series] = useState<number[]>(
//     investorsData.map((investor) => investor.amount)
//   );

//   return (
//     <div className="max-w-lg w-full bg-white rounded-lg shadow-sm dark:bg-gray-800 p-4 md:p-6">
//       <div className="flex justify-between mb-3">
//         <div className="flex justify-center items-center">
//           <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1">
//             Investment Distribution
//           </h5>
//         </div>
//         <div>
//           <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
//             {investorsData.length} Investors
//           </span>
//         </div>
//       </div>

//       <div className="py-6" id="donut-chart">
//         <ReactApexChart
//           options={chartOptions}
//           series={series}
//           type="donut"
//           height={420}
//         />
//       </div>
//     </div>
//   );
// };

// export default MonthlyTarget;





"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <div>Loading chart...</div>
});

interface Investor {
  id: number;
  name: string;
  amount: number;
  color: string;
}

const colorPalette = [
  "#1C64F2", "#16BDCA", "#FDBA8C", "#E74694", "#7E3AF2",
  "#FF5A1F", "#32D583", "#F05252", "#9061F9", "#3F83F8"
];

const TopInvestorsChart = (data: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [investorsData, setInvestorsData] = useState<Investor[]>([]);

  useEffect(() => {
    // Simulate API loading delay (remove in production)
    const timer = setTimeout(() => {
      transformInvestorData();
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [data]);

  // Transform the API data into the required format
  const transformInvestorData = () => {
    if (!data?.data?.top_investments) {
      setInvestorsData([]);
      return;
    }
    
    const transformedData = data.data.top_investments.map((investment: any, index: number) => ({
      id: investment.id,
      name: investment.user?.first_name || `Investor ${index + 1}`,
      amount: parseFloat(investment.investment_amount) || 0,
      color: colorPalette[index % colorPalette.length]
    }));
    
    setInvestorsData(transformedData);
  };

  const totalInvestment = investorsData.reduce(
    (sum, investor) => sum + investor.amount,
    0
  );
  const getChartOptions = (): ApexOptions => {
    return {
      series: investorsData.map((investor) => investor.amount),
      colors: investorsData.map((investor) => investor.color),
      chart: {
        height: 420,
        width: "100%",
        type: "donut",
        animations: {
          enabled: true,
      
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        },
      },
      stroke: {
        colors: ["transparent"],
        lineCap: "round",
        width: 0,
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontFamily: "Inter, sans-serif",
                offsetY: 40,
              },
              total: {
                showAlways: true,
                show: true,
                label: "Total Investment",
                fontFamily: "Inter, sans-serif",
                formatter: () => `$${totalInvestment.toLocaleString()}`,
              },
              value: {
                show: true,
                fontFamily: "Inter, sans-serif",
                offsetY: -20,
                formatter: (value) => `$${parseInt(value).toLocaleString()}`,
              },
            },
            size: "70%",
          },
          customScale: 1,
          offsetX: 0,
          offsetY: 0,
          expandOnClick: true,
          dataLabels: {
            offset: 0,
            minAngleToShowLabel: 10
          }
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      tooltip: {
        enabled: true,
        fillSeriesColor: false,
        style: {
          fontFamily: "Inter, sans-serif",
        },
        custom: ({ seriesIndex }) => {
          const investor = investorsData[seriesIndex];
          const percentage = ((investor.amount / totalInvestment) * 100).toFixed(1);
          
          return `
            <div class="px-3 py-2 bg-white rounded shadow-lg border border-gray-200">
              <div class="font-semibold text-gray-900">${investor.name}</div>
              <div class="text-gray-700">Investment: $${investor.amount.toLocaleString()}</div>
            </div>
          `;
        },
      },
      states: {
        hover: {
          filter: {
            type: 'lighten', // or 'darken'
                 // brightness value
          }
        },
        active: {
          filter: {
            type: 'none',
          }
        }
      },
      fill: {
        opacity: 1,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: "100%",
            },
          },
        },
      ],
    };
  };

  return (
    <div className="max-w-lg w-full bg-white rounded-lg shadow-sm dark:bg-gray-800 p-4 md:p-6">
      <div className="flex justify-between mb-3">
        <div className="flex justify-center items-center">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1">
         Top 10 Investors
          </h5>
        </div>
        <div>
          {/* <span className="bg-primary/30 text-primary text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
            {isLoading ? 'Loading...' : `${investorsData.length} Investor${investorsData.length !== 1 ? 's' : ''}`}
          </span> */}
        </div>
      </div>

      {isLoading ? (
        <div className="py-6 flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : investorsData.length > 0 ? (
        <div className="py-6" id="donut-chart">
          <ReactApexChart
            options={getChartOptions()}
            series={investorsData.map((investor) => investor.amount)}
            type="donut"
            height={420}
          />
        </div>
      ) : (
        <div className="py-6 text-center text-gray-500 h-96 flex items-center justify-center">
          No investment data available
        </div>
      )}
    </div>
  );
};

export default TopInvestorsChart;