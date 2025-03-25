"use client";

import { useState } from 'react';
import TopButtons from '@/components/Buttons/TopButtons';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { MoreDotIcon } from '@/icons';
import Image from 'next/image';
import { IoSearchOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  source: string;
  reminderDate: string;
  budget: string;
  condition: string;
  assignedTo: string;
  image: string;
}

const leadsData: Lead[] = [
  { id: 'L0001', name: 'John', email: 'johndoe@example.com', company: 'PDSN LLC', source: 'Referral', reminderDate: '01-01-23 at 12:00 AM', budget: '$500.00', condition: 'New', assignedTo: 'Arcangelo', image: '/images/user/user-1.jpg' },
  { id: 'L0004', name: 'Alex', email: 'alexsmith@example.com', company: 'Three Sticks Marketing', source: 'Website', reminderDate: '15-03-24 at 3:30 AM', budget: '$300.00', condition: 'Old', assignedTo: 'Myron', image: '/images/user/user-2.jpg' },
  { id: 'L0006', name: 'Jane', email: 'janedoe@example.com', company: 'Credible Holdings', source: 'Referral', reminderDate: '22-07-25 at 6:45 PM', budget: '$700.00', condition: 'New/Old', assignedTo: 'Myron', image: '/images/user/user-3.jpg' },
];

const LeadsTable = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const router = useRouter();

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };


  const handleNavigate = () => {
  
    router.push("/dashboard/leads/addnewlead")
  
  }

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <div className="inline-flex items-center gap-3">
          <div className="hidden sm:block">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  className="text-xs border rounded-lg font-family pl-9 pr-2 h-9 w-64 border-gray-300 focus:border-gray-400 focus:outline-none"
                  placeholder="Search"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <TopButtons label="Edit Columns" variant="outlined"  />
          <TopButtons label="Filters" variant="outlined" />
          <TopButtons onClick={handleNavigate} label="Add New Account" variant="primary" />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border  border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 bg-[#F7F7F7] dark:border-white/[0.05]">
              <TableRow>
                {['ID', 'Name', 'Email', 'Company', 'Source', 'Reminder Date', 'Budget', 'Condition', 'Assigned To', 'Action'].map((heading) => (
                  <TableCell key={heading} isHeader className="px-3  py-3 font-family font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400">
               <div className='flex justify-between items-center'>
                 
               {heading} 
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path d="M4.8513 6.35227C4.63162 6.57194 4.63162 6.9281 4.8513 7.14777C5.07097 7.36743 5.42707 7.36743 5.64675 7.14777L4.8513 6.35227ZM7.49902 4.50002H8.06152C8.06152 4.27251 7.9245 4.0674 7.71427 3.98034C7.50412 3.89327 7.26217 3.9414 7.1013 4.10227L7.49902 4.50002ZM6.93652 13.5C6.93652 13.8107 7.18837 14.0625 7.49902 14.0625C7.80967 14.0625 8.06152 13.8107 8.06152 13.5H6.93652ZM13.1468 11.6477C13.3664 11.4281 13.3664 11.072 13.1468 10.8523C12.9271 10.6326 12.5709 10.6326 12.3513 10.8523L13.1468 11.6477ZM10.499 13.5H9.93652C9.93652 13.7275 10.0736 13.9326 10.2838 14.0197C10.4939 14.1068 10.7359 14.0586 10.8968 13.8977L10.499 13.5ZM11.0615 4.50002C11.0615 4.18936 10.8097 3.93752 10.499 3.93752C10.1884 3.93752 9.93652 4.18936 9.93652 4.50002H11.0615ZM5.64675 7.14777L7.89675 4.89777L7.1013 4.10227L4.8513 6.35227L5.64675 7.14777ZM6.93652 4.50002L6.93652 13.5H8.06152V4.50002H6.93652ZM12.3513 10.8523L10.1013 13.1023L10.8968 13.8977L13.1468 11.6477L12.3513 10.8523ZM11.0615 13.5L11.0615 4.50002H9.93652L9.93652 13.5H11.0615Z" fill="#616161"/>
</svg>
               </div>
                
                
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {leadsData.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="px-5 py-4 text-[#616161] font-normal text-xs font-family">{lead.id}</TableCell>
                  <TableCell className="px-5 py-4 text-xs flex items-center gap-3 font-family text-[#616161] font-normal">
                    <Image width={40} height={40} src={lead.image} alt={lead.name} className="rounded-full" />
                    <span>{lead.name}</span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-xs text-[#616161] font-normal font-family">{lead.email}</TableCell>
                  <TableCell className="px-5 py-4 text-xs text-[#616161] font-normal font-family">{lead.company}</TableCell>
                  <TableCell className="px-5 py-4 text-xs text-[#616161] font-normal font-family">{lead.source}</TableCell>
                  <TableCell className="px-5 py-4 text-xs text-[#616161] font-normal font-family">{lead.reminderDate}</TableCell>
                  <TableCell className="px-5 py-4 text-xs text-[#616161] font-normal font-family">{lead.budget}</TableCell>
                  <TableCell className="px-5 py-4 text-xs text-[#616161] font-normal font-family">{lead.condition}</TableCell>
                  <TableCell className="px-5 py-4 text-xs text-[#616161] font-normal font-family">{lead.assignedTo}</TableCell>
                  <TableCell className="px-5 py-4 text-xs text-[#616161] font-normal font-family">
                    <div className="relative inline-block">
                      <button onClick={() => toggleDropdown(lead.id)} className="dropdown-toggle">
                        <MoreDotIcon className="text-gray-400 font-family hover:text-gray-700 dark:hover:text-gray-300" />
                      </button>
                      <Dropdown isOpen={openDropdown === lead.id} onClose={closeDropdown} className="w-40 p-2">
                        <DropdownItem onItemClick={closeDropdown} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                          View More
                        </DropdownItem>
                        <DropdownItem onItemClick={closeDropdown} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                          Delete
                        </DropdownItem>
                      </Dropdown>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default LeadsTable;



// import Badge from '@/components/ui/badge/Badge';
// import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
// import Image from 'next/image';
// import React from 'react'

// interface Order {
//     id: number;
//     user: {
//       image: string;
//       name: string;
//       role: string;
//     };
//     projectName: string;
//     team: {
//       images: string[];
//     };
//     status: string;
//     budget: string;
//   }

// const tableData: Order[] = [
//     {
//       id: 1,
//       user: {
//         image: "/images/user/user-17.jpg",
//         name: "Lindsey Curtis",
//         role: "Web Designer",
//       },
//       projectName: "Agency Website",
//       team: {
//         images: [
//           "/images/user/user-22.jpg",
//           "/images/user/user-23.jpg",
//           "/images/user/user-24.jpg",
//         ],
//       },
//       budget: "3.9K",
//       status: "Active",
//     },
//     {
//       id: 2,
//       user: {
//         image: "/images/user/user-18.jpg",
//         name: "Kaiya George",
//         role: "Project Manager",
//       },
//       projectName: "Technology",
//       team: {
//         images: ["/images/user/user-25.jpg", "/images/user/user-26.jpg"],
//       },
//       budget: "24.9K",
//       status: "Pending",
//     },
//     {
//       id: 3,
//       user: {
//         image: "/images/user/user-17.jpg",
//         name: "Zain Geidt",
//         role: "Content Writing",
//       },
//       projectName: "Blog Writing",
//       team: {
//         images: ["/images/user/user-27.jpg"],
//       },
//       budget: "12.7K",
//       status: "Active",
//     },
//     {
//       id: 4,
//       user: {
//         image: "/images/user/user-20.jpg",
//         name: "Abram Schleifer",
//         role: "Digital Marketer",
//       },
//       projectName: "Social Media",
//       team: {
//         images: [
//           "/images/user/user-28.jpg",
//           "/images/user/user-29.jpg",
//           "/images/user/user-30.jpg",
//         ],
//       },
//       budget: "2.8K",
//       status: "Cancel",
//     },
//     {
//       id: 5,
//       user: {
//         image: "/images/user/user-21.jpg",
//         name: "Carla George",
//         role: "Front-end Developer",
//       },
//       projectName: "Website",
//       team: {
//         images: [
//           "/images/user/user-31.jpg",
//           "/images/user/user-32.jpg",
//           "/images/user/user-33.jpg",
//         ],
//       },
//       budget: "4.5K",
//       status: "Active",
//     },
//   ];

// const LeadsTable = () => {
//   return (
// <>
// <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
//       <div className="max-w-full overflow-x-auto">
//         <div className="min-w-[1102px]">
//           <Table>
//             {/* Table Header */}
//             <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
//               <TableRow>
//                 <TableCell 
//                   isHeader
//                   className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
//                 >
//                   User
//                 </TableCell>
//                 <TableCell
//                   isHeader
//                   className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
//                 >
//                   Project Name
//                 </TableCell>
//                 <TableCell
//                   isHeader
//                   className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
//                 >
//                   Team
//                 </TableCell>
//                 <TableCell
//                   isHeader
//                   className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
//                 >
//                   Status
//                 </TableCell>
//                 <TableCell
//                   isHeader
//                   className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
//                 >
//                   Budget
//                 </TableCell>
//               </TableRow>
//             </TableHeader>

//             {/* Table Body */}
//             <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
//               {tableData.map((order) => (
//                 <TableRow key={order.id}>
//                   <TableCell className="px-5 py-4 sm:px-6 text-start">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 overflow-hidden rounded-full">
//                         <Image
//                           width={40}
//                           height={40}
//                           src={order.user.image}
//                           alt={order.user.name}
//                         />
//                       </div>
//                       <div>
//                         <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
//                           {order.user.name}
//                         </span>
//                         <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
//                           {order.user.role}
//                         </span>
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
//                     {order.projectName}
//                   </TableCell>
//                   <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
//                     <div className="flex -space-x-2">
//                       {order.team.images.map((teamImage, index) => (
//                         <div
//                           key={index}
//                           className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
//                         >
//                           <Image
//                             width={24}
//                             height={24}
//                             src={teamImage}
//                             alt={`Team member ${index + 1}`}
//                             className="w-full"
//                           />
//                         </div>
//                       ))}
//                     </div>
//                   </TableCell>
//                   <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
//                     <Badge
//                       size="sm"
//                       color={
//                         order.status === "Active"
//                           ? "success"
//                           : order.status === "Pending"
//                           ? "warning"
//                           : "error"
//                       }
//                     >
//                       {order.status}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
//                     {order.budget}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </div>
//     </div>


// </>
// )
// }

// export default LeadsTable
