import React from "react";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";

const Timeline = () => {
  const steps = [
    "Cable Replacement", // Fixed typo to match image
    "Control System Installation",
    "Interior Cabin Lighting", // Fixed typo to match image
    "Handrail Replacement",
    "Automatic Door Operators",
    "Intercom and Alarm System Installation",
    "Completion & Handover for Sold",
    "Sold Out",
  ];

  return (
    <div className="flex justify-center">
      <VerticalTimeline lineColor="#bbb">
        {/* First Step - Motor Installation */}
        <VerticalTimelineElement
          iconStyle={{ 
            background: "transparent", 
            color: "#d49149", 
            fontSize: "18px", 
            boxShadow: "none" 
          }}
          icon={<FaRegCircle />}
          contentStyle={{
            background: "#f9f9f9",
            color: "#333",
            borderRadius: "8px",
            padding: "15px",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
          }}
          contentArrowStyle={{ display: "none" }}
        >
          <h3 className="text-black font-bold text-lg whitespace-nowrap overflow-hidden text-ellipsis">
            Motor Installation
          </h3>
        </VerticalTimelineElement>

        {/* Subsequent Steps - Alternating Left & Right */}
        {steps.map((item, index) => (
          <VerticalTimelineElement
            key={index}
            iconStyle={{
              background: "transparent",
              color: "#bbb",
              fontSize: "18px",
              boxShadow: "none",
            }}
            icon={<FaCheckCircle />}
            contentStyle={{
              background: "transparent",
              color: "#333",
              borderRadius: "8px",
              padding: "15px",
              boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
              textAlign: index % 2 === 0 ? "left" : "right",
            }}
            contentArrowStyle={{ display: "none" }}
            position={index % 2 === 0 ? "left" : "right"}
          >
            <h3 className="text-gray-700 text-md whitespace-nowrap overflow-hidden text-ellipsis">
              {item}
            </h3>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </div>
  );
};

export default Timeline;

// import React from "react";
// import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
// import "react-vertical-timeline-component/style.min.css";
// import { FaBriefcase } from "react-icons/fa";

// const Timeline = () => {
//   return (
//     <div>
//       {/* <h2 className="text-center text-2xl font-bold my-5">My Timeline</h2> */}
//       <VerticalTimeline>
//         <VerticalTimelineElement
//           className="vertical-timeline-element--work"
//           contentStyle={{ background: "#f9f9f9", color: "#333" }}
//           contentArrowStyle={{ borderRight: "7px solid #f9f9f9" }}
//           date="2023 - Present"
//           iconStyle={{ background: "#007bff", color: "#fff" }}
//           icon={<FaBriefcase />}
//         >
//           <h3 className="vertical-timeline-element-title">Software Developer</h3>
//           <h4 className="vertical-timeline-element-subtitle">Tech Company</h4>
//           <p>Working on modern web applications with React and Next.js.</p>
//         </VerticalTimelineElement>

//         <VerticalTimelineElement
//           className="vertical-timeline-element--education"
//           date="2020 - 2023"
//           iconStyle={{ background: "#f39c12", color: "#fff" }}
//           icon={<FaBriefcase />}
//         >
//           <h3 className="vertical-timeline-element-title">Bachelor's in Computer Science</h3>
//           <h4 className="vertical-timeline-element-subtitle">University Name</h4>
//           <p>Studied software development, algorithms, and web technologies.</p>
//         </VerticalTimelineElement>
//       </VerticalTimeline>
//     </div>
//   );
// };

// export default Timeline;

