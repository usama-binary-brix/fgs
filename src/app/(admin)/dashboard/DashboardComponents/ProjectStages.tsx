import React from 'react';
import { TfiArrowTopRight } from 'react-icons/tfi';

const ProjectStages = () => {
  const projects = [
    {
      year: '2020',
      name: 'Holst C25L SN# CO9701',
      stage: 'Battery Replacement',
      status: 'Project Stage',
      progress: 75 // percentage
    },
    {
      year: '2021',
      name: 'Holst C30L SN# CO9702',
      stage: 'Maintenance',
      status: 'Project Stage',
      progress: 40 // percentage
    },
    {
      year: '2022',
      name: 'Holst C35L SN# CO9703',
      stage: 'Initial Assessment',
      status: 'Planning Stage',
      progress: 15 // percentage
    }
  ];

  return (
    <div className="font-sans max-w-[600px] h-[13rem] overflow-auto mx-auto text-sm bg-white p-2 rounded-lg">
      <h1 className="text-lg mb-5 text-gray-800 font-semibold">Projects by Stages</h1>
      
      {projects.map((project, index) => (
        <div 
          key={index}
          className={`mb-3 ${index < projects.length - 1 ? 'border p-2 rounded-lg border-gray-200' : ''}`}
        >
        <div className='flex justify-between items-center'>
        <div className="text-base font-medium text-gray-700 mb-1.5">
            {project.year} {project.name}
          </div>

          <div className="text-base font-medium text-gray-700 mb-1 bg-[#FFF1E0] p-2 rounded-full">
        <TfiArrowTopRight className='text-[#D18428]' size={20} />
          </div>
        </div>
          
          {project.stage && (
            <div className="text-sm text-gray-600 mb-1">
              {project.stage}
            </div>
          )}
            {project.status && (
            <div className="text-xs text-gray-500 flex justify-between items-center">
              <span>{project.status}</span>
              {/* <span>{project.progress}%</span> */}
            </div>
          )}
          {/* Progress bar */}
          <div className="h-2 bg-gray-200 rounded-full mt-2 mb-2 overflow-hidden">
            <div
              className="h-full bg-[#D18428] rounded-full transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
          
        
        </div>
      ))}
    </div>
  );
};

export default ProjectStages;