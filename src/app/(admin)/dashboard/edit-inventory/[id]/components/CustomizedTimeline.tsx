// import * as React from 'react';
// import Timeline from '@mui/lab/Timeline';
// import TimelineItem from '@mui/lab/TimelineItem';
// import TimelineSeparator from '@mui/lab/TimelineSeparator';
// import TimelineConnector from '@mui/lab/TimelineConnector';
// import TimelineContent from '@mui/lab/TimelineContent';
// import TimelineDot from '@mui/lab/TimelineDot';
// import Typography from '@mui/material/Typography';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import { IoIosCheckmarkCircle, IoMdRadioButtonOn } from 'react-icons/io';

// export interface TimelineStep {
//   name: string;
//   status: "completed" | "active" | "pending";
//   description?: string;
// }

// interface CustomizedTimelineProps {
//   steps: TimelineStep[];
// }

// export default function CustomizedTimeline({ steps = [] }: CustomizedTimelineProps) {
//   const lastCompletedIndex = steps.map(step => step.status).lastIndexOf("completed");

//   return (
//     <Timeline position="alternate">
//       {steps.map((step, index) => {
//         const isActive = step.status === "active";
//         const isCompleted = step.status === "completed";
//         const isLast = index === steps.length - 1;

//         return (
//           <TimelineItem key={index}>
//             <TimelineSeparator>
//               <TimelineConnector
//                 sx={{
//                   backgroundColor: index <= lastCompletedIndex ? '#d49149' : 'grey.300',
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
//                 ) : isCompleted ? (
//                   <IoIosCheckmarkCircle className='text-[#d49149] text-lg' />
// ) : (
//   <IoMdRadioButtonOn className={`text-lg ${isCompleted ? 'text-[#d49149]' : 'text-gray-400'}`} />
// )}
//               </TimelineDot>
//               {!isLast && (
//                 <TimelineConnector
//                   sx={{
//                     backgroundColor: (index == lastCompletedIndex || index < lastCompletedIndex) ? '#d49149' : 'grey.300',
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

import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import { IoIosCheckmarkCircle, IoMdRadioButtonOn } from 'react-icons/io';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { IoWarningOutline } from 'react-icons/io5';
import AddInventoryCostSummary from './AddInventoryCostSummary';

export interface TimelineStep {
  name: string;
  status: "completed" | "active" | "pending";
  description?: string;
}

interface CustomizedTimelineProps {
  steps: TimelineStep[];
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};

export default function CustomizedTimeline({ steps = [] }: CustomizedTimelineProps) {
  const lastCompletedIndex = steps.map(step => step.status).lastIndexOf("completed");
  const [modalOpen, setModalOpen] = React.useState(false);

  const allPreviousCompleted = steps.every(step => step.status === "completed");

  const allSteps = [
    ...steps,
    {
      name: "Completion & Handover for Sold",
      status: allPreviousCompleted ? "active" : "pending",
      description: ""
    },
    { name: "Sold Out", status: "pending", description: "" }
  ];

  const handleOpenModal = () => {
    if (allPreviousCompleted) {
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Timeline position="alternate">
        {allSteps.map((step, index) => {
          const isActive = step.status === "active";
          const isCompleted = step.status === "completed";
          const isLast = index === allSteps.length - 1;
          const isSecondLast = index === allSteps.length - 2;
          const isCompletionStep = step.name === "Completion & Handover for Sold";

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
                    <IoIosCheckmarkCircle className='text-[#d49149] text-lg' />
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

              <TimelineContent sx={{ py: '0px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span
                    className='capitalize'
                    style={{
                      color: isActive ? 'black' : isCompleted ? '#414141' : 'gray',
                      fontWeight: isActive || isCompleted ? 550 : 550,
                      fontSize: isActive ? '18px' : '18px',
                      cursor: (isCompletionStep && allPreviousCompleted) ? 'pointer' : 'default',
                    }}
                    onClick={isCompletionStep && allPreviousCompleted ? handleOpenModal : undefined}
                  >
                    {step.name || ''}
                  </span>
                  {step.description && (
                    <p style={{ color: 'grey' }}>
                      {step.description}
                    </p>
                  )}
                  {isCompletionStep && allPreviousCompleted && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }} className='gap-1'>
                      <IoWarningOutline className='text-[#d49149]' />
                      <span style={{ color: '#d49149', fontWeight: 500 }} className='text-xs mt-1'>
                        Action Needed
                      </span>
                    </div>
                  )}
                </div>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>




      <AddInventoryCostSummary open={modalOpen}
        onClose={handleCloseModal} />


    </>
  );
}