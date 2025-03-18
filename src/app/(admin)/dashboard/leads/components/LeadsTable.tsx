
'use client'

import TopButtons from '@/components/Buttons/TopButtons';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { MoreDotIcon } from '@/icons';
import Image from 'next/image';
import { useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';

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
  // Add more data as needed
];

const LeadsTable = () => {
  const [isOpen, setIsOpen] = useState(false);
  
    function toggleDropdown() {
      setIsOpen(!isOpen);
    }
  
    function closeDropdown() {
      setIsOpen(false);
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
               className="text-xs border rounded-lg pl-9 pr-2 h-9 w-64 border-gray-300 focus:border-gray-400 focus:outline-none"
               placeholder="Search"
             />
           </div>
         </div>
       </div>
     </div>

     <div className="flex items-center gap-3">
         <TopButtons label="Edit Columns" variant="outlined" />
         <TopButtons label="Filters" variant="outlined" />
         <TopButtons label="Add New Account" variant="primary" />
    
       </div>
    </div>
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {['ID', 'Name', 'Email', 'Company', 'Source', 'Reminder Date', 'Budget', 'Condition', 'Assigned To', 'Action'].map((heading) => (
                <TableCell key={heading} isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400">{heading}</TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {leadsData.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="px-5 py-4 text-xs">{lead.id}</TableCell>
                <TableCell className="px-5 py-4 text-xs flex items-center gap-3">
                  <Image width={40} height={40} src={lead.image} alt={lead.name} className="rounded-full" />
                  <span>{lead.name}</span>
                </TableCell>
                <TableCell className="px-5 py-4 text-xs">{lead.email}</TableCell>
                <TableCell className="px-5 py-4 text-xs">{lead.company}</TableCell>
                <TableCell className="px-5 py-4 text-xs">{lead.source}</TableCell>
                <TableCell className="px-5 py-4 text-xs">{lead.reminderDate}</TableCell>
                <TableCell className="px-5 py-4 text-xs">{lead.budget}</TableCell>
                <TableCell className="px-5 py-4 text-xs">{lead.condition}</TableCell>
                <TableCell className="px-5 py-4 text-xs">{lead.assignedTo}</TableCell>
                <TableCell className="px-5 py-4 text-xs">
              
                <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
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
