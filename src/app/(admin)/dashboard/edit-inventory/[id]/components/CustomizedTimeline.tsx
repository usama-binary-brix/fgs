import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { IoMdRadioButtonOn } from 'react-icons/io';

export interface TimelineStep {
  name: string;
  status: "completed" | "active" | "pending";
  description?: string;
}

interface CustomizedTimelineProps {
  steps: TimelineStep[];
}

export default function CustomizedTimeline({ steps = [] }: CustomizedTimelineProps) {
  const lastCompletedIndex = steps.map(step => step.status).lastIndexOf("completed");

  return (
    <Timeline position="alternate">
      {steps.map((step, index) => {
        const isActive = step.status === "active";
        const isCompleted = step.status === "completed";
        const isLast = index === steps.length - 1;

        return (
          <TimelineItem key={index}>
            <TimelineSeparator>
              <TimelineConnector
                sx={{
                  backgroundColor: index <= lastCompletedIndex ? '#d49149' : 'grey.300',
                  height: index === 0 ? '10%' : '10%',
                  alignSelf: index === 0 ? 'flex-end' : 'unset',
                  margin: 0,
                  padding: 0,
                  maxHeight: '0px'
                }}
              />
              <TimelineDot sx={{
                backgroundColor: 'transparent',
                boxShadow: 'none',
                p: 0,
                m: 0,
                my: 0
              }}>
                {isActive ? (
                  <IoMdRadioButtonOn className='text-[#d49149] text-lg' />
                ) : isCompleted ? (
  <CheckCircleIcon className='text-[#d49149] text-lg' />
) : (
  <IoMdRadioButtonOn className={`text-lg ${isCompleted ? 'text-[#d49149]' : 'text-gray-400'}`} />
)}
              </TimelineDot>
              {!isLast && (
                <TimelineConnector
                  sx={{
                    backgroundColor: (index == lastCompletedIndex || index < lastCompletedIndex) ? '#d49149' : 'grey.300',
                    height: '100%',
                    margin: 0,
                    minHeight: '10px'
                  }}
                />
              )}
            </TimelineSeparator>

            <TimelineContent sx={{ py: '0px', }}>
              <span
                className='capitalize'
                style={{
                  color: isActive ? 'black' : isCompleted ? '#414141' : 'gray',
                  fontWeight: isActive || isCompleted ? 550 : 550,
                  fontSize: isActive ? '18px' : '18px',

                }}
              >
                {step.name || ''}
              </span>
              <p style={{ color: 'grey' }}>
                {step.description}
              </p>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}


// import * as React from 'react';
// import Timeline from '@mui/lab/Timeline';
// import TimelineItem from '@mui/lab/TimelineItem';
// import TimelineSeparator from '@mui/lab/TimelineSeparator';
// import TimelineConnector from '@mui/lab/TimelineConnector';
// import TimelineContent from '@mui/lab/TimelineContent';
// import TimelineDot from '@mui/lab/TimelineDot';
// import Typography from '@mui/material/Typography';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import { IoMdRadioButtonOn } from 'react-icons/io';

// export interface TimelineStep {
//   name: string;
//   status: "completed" | "active" | "pending";
//   description?: string;
// }

// interface CustomizedTimelineProps {
//   steps: TimelineStep[];
// }

// export default function CustomizedTimeline({ steps = [] }: CustomizedTimelineProps) {
//   return (
//     <Timeline position="alternate">
//       {steps.map((step, index) => {
//         const isActive = step.status === "active";
//         const isCompleted = step.status === "completed";
//         const isPending = step.status === "pending";
//         const isLast = index === steps.length - 1;
        
//         // Determine if the previous step is completed or active
//         const prevStepCompleted = index > 0 && 
//           (steps[index - 1].status === "completed" || steps[index - 1].status === "active");
        
//         // Determine if the current step or any previous step is completed/active
//         const isStepOrPreviousCompleted = steps.slice(0, index + 1).some(s => 
//           s.status === "completed" || s.status === "active"
//         );

//         return (
//           <TimelineItem key={index}>
//             <TimelineSeparator>
//               {/* Top connector - colored if previous step is completed/active */}
//               <TimelineConnector
//                 sx={{
//                   backgroundColor: prevStepCompleted ? '#d49149' : 'grey.300',
//                   height: index === 0 ? '10%' : '10%',
//                   alignSelf: index === 0 ? 'flex-end' : 'unset',
//                   margin: 0,
//                   padding: 0,
//                   maxHeight: '0px'
//                 }}
//               />
              
//               <TimelineDot sx={{
//                 backgroundColor: 'transparent',
//                 boxShadow: 'none',
//                 p: 0,
//                 m: 0,
//                 my: 0
//               }}>
//                 {isActive ? (
//                   <IoMdRadioButtonOn className='text-[#d49149] text-lg' />
//                 ) : (
//                   <IoMdRadioButtonOn className={`text-lg ${isCompleted ? 'text-[#d49149]' : 'text-gray-400'}`} />
//                 )}
//               </TimelineDot>
              
//               {/* Bottom connector - colored if current step is completed/active */}
//               {!isLast && (
//                 <TimelineConnector
//                   sx={{
//                     backgroundColor: isStepOrPreviousCompleted ? '#d49149' : 'grey.300',
//                     height: '100%',
//                     margin: 0,
//                     minHeight: '10px'
//                   }}
//                 />
//               )}
//             </TimelineSeparator>

//             <TimelineContent sx={{ py: '0px', }}>
//               <span
//                 className='capitalize'
//                 style={{
//                   color: isActive ? 'black' : isCompleted ? '#414141' : 'gray',
//                   fontWeight: isActive || isCompleted ? 550 : 550,
//                   fontSize: isActive ? '18px' : '18px',
//                 }}
//               >
//                 {step.name || ''}
//               </span>
//               <p style={{ color: 'grey' }}>
//                 {step.description}
//               </p>
//             </TimelineContent>
//           </TimelineItem>
//         );
//       })}
//     </Timeline>
//   );
// }