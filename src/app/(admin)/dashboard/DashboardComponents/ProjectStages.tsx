import { useRouter } from 'next/navigation';
import NProgress from 'nprogress';
import React from 'react';
import { TfiArrowTopRight } from 'react-icons/tfi';

const ProjectStages = (data: any) => {

const router = useRouter()

const handleSendToInventory = (id: any) => {
       NProgress.start();
  
  router.push(`/dashboard/edit-inventory/${id}?tab=reconditioning`);
};
  return (
    <>
    <div className='bg-white max-w-[600px] h-[16rem] overflow-auto rounded-xl shadow-lg'>
 <div className="h-[16rem] overflow-auto">
      <h1 className="text-lg text-gray-800 font-semibold sticky top-0 pt-1 pl-2 bg-white">Projects by Stages</h1>
    <div className="font-sans  mx-auto text-sm p-2 rounded-lg">

      {data?.data?.inventory_stages?.map((project: any, index: any) => (
        <div
          key={index}
          className={`mb-3 ${index < data?.data?.inventory_stages.length - 1 ? 'border p-2 rounded-lg border-gray-200' : ''}`}
        >
          <div className='flex justify-between items-center'>
            <div className="text-base font-semibold text-gray-700 mb-1.5">
              {project?.inventory?.listing_number}
            </div>

            <div className="text-base font-medium text-gray-700 mb-1 bg-[#FFF1E0] p-2 rounded-full cursor-pointer"
              onClick={() => handleSendToInventory(project?.inventory?.id)}
            >
              <TfiArrowTopRight className='text-[#D18428]' size={20} />
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-1">
            {project?.inventory_stage?.name}
          </div>
          <div className='flex items-center justify-between'>

            <div className="text-xs text-gray-500 flex justify-between items-center">
              <span>
                {project?.task_name}

              </span>
            </div>
            <div className="text-xs text-gray-500 flex justify-between items-center">
              <span>
                {project?.employee?.first_name}

              </span>
            </div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full mt-2 mb-2 overflow-hidden">
            <div
              className="h-full bg-[#D18428] rounded-full transition-all duration-300"
              style={{ width: `${project.completion_percentage}%` }}
            ></div>
          </div>


        </div>
      ))}
    </div>

  </div>

    </div>

    </>
  );
};

export default ProjectStages;