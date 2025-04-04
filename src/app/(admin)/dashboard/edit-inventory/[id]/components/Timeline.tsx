'use client'
import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { LuCircle } from "react-icons/lu";

const Timeline = () => {
  const steps = [
    { text: "Motor Installation", status: "completed", description: "Installing the motor in the system." },
    { text: "Cable Replacement", status: "completed", description: "Replacing old cables with new ones." },
    { text: "Control System Installation", status: "completed", description: "Setting up the control systems." },
    { text: "Interior Cabin Lighting", status: "completed", description: "Installing lights inside the cabin." },
    { text: "Handrail Replacement", status: "active", description: "Replacing old handrails with new ones." },
    { text: "Automatic Door Operators", status: "pending", description: "Installing automatic door operators." },
    { text: "Intercom and Alarm System Installation", status: "pending", description: "Setting up intercom and alarm systems." },
    { text: "Completion & Handover for Sold", status: "pending", description: "Finalizing the project and preparing for handover." },
    { text: "Sold Out", status: "pending", description: "Project sold and completed." },
    
  ];

  const lastCompletedIndex = steps.map(step => step.status).lastIndexOf("completed");
  const iconHeight = 22; 
  const stepSpacing = 1.5; 
  const totalHeight = (steps.length - 1) * stepSpacing + iconHeight; 
  return (
    <div className="w-full flex justify-center">
      <div className="relative flex flex-col items-center w-full max-w-3xl">
                <div 
          className="absolute left-1/2 transform -translate-x-1/2 w-[2px] bg-gray-300" 
          style={{
            height: `${totalHeight}rem`,
            top: "1rem", 
          }}
        ></div>

        <div 
          className="absolute left-1/2 transform -translate-x-1/2 w-[2px] bg-[#d49149]" 
          style={{
            top: "1rem",
            height: `${(lastCompletedIndex + 1) * 4}rem`, 
          }}
        ></div>

        {steps.map((step, index) => {
          const isActive = step.status === "active";
          const isCompleted = step.status === "completed";

          return (
            <div className="relative flex items-start mb-6 w-full" key={index}>
              {index % 2 === 0 ? (
                <div className={`w-1/2 pr-4 text-right ${isActive ? "text-black font-semibold text-lg" : isCompleted ? "text-[#414141] font-semibold" : "text-gray-500"}`}>
                  {step.text}
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              ) : (
                <div className="w-1/2"></div>
              )}

              {/* Status Icon */}
              <div className="relative flex items-center justify-center w-6 z-50">
                {isActive ? (
                  <>
                    <LuCircle size={22} className="text-[#d49149] z-50" />
                    <div className="absolute w-2 h-2 bg-[#d49149] rounded-full"></div>
                  </>
                ) : (
                  <FaCheckCircle size={18} className={isCompleted ? "text-[#d49149]" : "text-gray-400"} />
                )}
              </div>

              {index % 2 !== 0 ? (
                <div className={`w-1/2 pl-4 ${isActive ? "text-black font-semibold text-lg" : isCompleted ? "text-gray-500 font-semibold" : "text-gray-500"}`}>
                  {step.text}
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              ) : (
                <div className="w-1/2"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;



// import React from "react";
// import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
// import "react-vertical-timeline-component/style.min.css";
// import { FaCheckCircle, FaRegCircle } from "react-icons/fa";

// const Timeline = () => {
//   const steps = [
//     "Cable Replacement", // Fixed typo to match image
//     "Control System Installation",
//     "Interior Cabin Lighting", // Fixed typo to match image
//     "Handrail Replacement",
//     "Automatic Door Operators",
//     "Intercom and Alarm System Installation",
//     "Completion & Handover for Sold",
//     "Sold Out",
//   ];

//   return (
//     <div className="flex justify-center">
//       <VerticalTimeline lineColor="#bbb">
//         {/* First Step - Motor Installation */}
//         <VerticalTimelineElement
//           iconStyle={{ 
//             background: "transparent", 
//             color: "#d49149", 
//             fontSize: "18px", 
//             boxShadow: "none" 
//           }}
//           icon={<FaRegCircle />}
//           contentStyle={{
//             background: "#f9f9f9",
//             color: "#333",
//             borderRadius: "8px",
//             padding: "15px",
//             boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
//           }}
//           contentArrowStyle={{ display: "none" }}
//         >
//           <h3 className="text-black font-bold text-lg whitespace-nowrap overflow-hidden text-ellipsis">
//             Motor Installation
//           </h3>
//         </VerticalTimelineElement>

//         {/* Subsequent Steps - Alternating Left & Right */}
//         {steps.map((item, index) => (
//           <VerticalTimelineElement
//             key={index}
//             iconStyle={{
//               background: "transparent",
//               color: "#bbb",
//               fontSize: "18px",
//               boxShadow: "none",
//             }}
//             icon={<FaCheckCircle />}
//             contentStyle={{
//               background: "#f9f9f9",
//               color: "#333",
//               borderRadius: "8px",
//               padding: "15px",
//               boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
//               textAlign: index % 2 === 0 ? "left" : "right",
//             }}
//             contentArrowStyle={{ display: "none" }}
//             position={index % 2 === 0 ? "left" : "right"}
//           >
//             <h3 className="text-gray-700 text-md whitespace-nowrap overflow-hidden text-ellipsis">
//               {item}
//             </h3>
//           </VerticalTimelineElement>
//         ))}
//       </VerticalTimeline>
//     </div>
//   );
// };

// export default Timeline;
