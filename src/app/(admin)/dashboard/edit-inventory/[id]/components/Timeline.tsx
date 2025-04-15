

import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import TimelineDot from '@mui/lab/TimelineDot';
import { IoMdRadioButtonOn } from 'react-icons/io';

export default function CustomizedTimeline() {
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
                  margin: 0, // Remove margin
                  padding:0,
                  maxHeight: '0px' // Ensure minimum height
                }} 
              />
              <TimelineDot sx={{ 
                backgroundColor: 'transparent', 
                boxShadow: 'none',
                p: 0,
                m: 0, // Remove margin
                my: 0 // Remove vertical margin
              }}>
                {isActive ? (
                  <IoMdRadioButtonOn className='text-[#d49149] text-lg'/>
                ) : (
                  <CheckCircleIcon sx={{ 
                    color: isCompleted ? '#d49149' : 'grey.400',
                    fontSize: '1.125rem'
                  }} />
                )}
              </TimelineDot>
              {!isLast && (
                <TimelineConnector 
                  sx={{ 
                    backgroundColor: (index == lastCompletedIndex || index < lastCompletedIndex) ? '#d49149' : 'grey.300',
                    height: '100%',
                    margin: 0, // Remove margin
                    minHeight: '20px' // Ensure minimum height
                  }} 
                />
              )}
            </TimelineSeparator>

            <TimelineContent sx={{ py: '0px' }}>
              <Typography 
                variant="h6" 
                component="span"
                sx={{
                  color: isActive ? 'black' : isCompleted ? '#414141' : 'grey',
                  fontWeight: isActive || isCompleted ? 600 : 'normal',
                  fontSize: isActive ? '1.125rem' : '1rem'
                }}
              >
                { step.text || ''}
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey' }}>
                {step.description}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}
