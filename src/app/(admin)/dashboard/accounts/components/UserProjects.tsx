import React from 'react'

const UserProjects = (user: any) => {

  console.log(user?.user, 'user data ')

  const projects = [
    { name: "ThyssenKrupp Evolution", investment_amount: 500, profits: 250.75, status: "Sold" },
    { name: "KONE MiniSpace", investment_amount: 300, profits: null, status: "Sold" },
    { name: "Mitsubishi Electric NEXIEZ", investment_amount: 700, profits: null, status: "Sold" },
    { name: "Schindler 3300", investment_amount: 4000, profits: 210.30, status: "Sold" },
    { name: "Schindler 3100", investment_amount: 250, profits: null, status: "Sold" },
    { name: "Mitsubishi Electric DiamondTrac", investment_amount: 8000, profits: 190.60, status: "Sold" }
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Scrollable table container */}
      <div className="max-w-full h-80 overflow-y-auto">
        <table className="w-full border-collapse">
          {/* Table Header */}
          <thead className="bg-[#F7F7F7] dark:border-white/[0.05]">
            <tr>
              {['Project', 'Investment Amount', 'Profits', 'Payment Status'].map((heading) => (
                <th key={heading} className="px-5 py-3 uppercase text-[#616161] font-[500] text-start text-theme-sm dark:text-gray-400">
                  <div className="w-full flex justify-between items-center">
                    {heading}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M4.8513 6.35227C4.63162 6.57194 4.63162 6.9281 4.8513 7.14777C5.07097 7.36743 5.42707 7.36743 5.64675 7.14777L4.8513 6.35227ZM7.49902 4.50002H8.06152C8.06152 4.27251 7.9245 4.0674 7.71427 3.98034C7.50412 3.89327 7.26217 3.9414 7.1013 4.10227L7.49902 4.50002ZM6.93652 13.5C6.93652 13.8107 7.18837 14.0625 7.49902 14.0625C7.80967 14.0625 8.06152 13.8107 8.06152 13.5H6.93652ZM13.1468 11.6477C13.3664 11.4281 13.3664 11.072 13.1468 10.8523C12.9271 10.6326 12.5709 10.6326 12.3513 10.8523L13.1468 11.6477ZM10.499 13.5H9.93652C9.93652 13.7275 10.0736 13.9326 10.2838 14.0197C10.4939 14.1068 10.7359 14.0586 10.8968 13.8977L10.499 13.5ZM11.0615 4.50002C11.0615 4.18936 10.8097 3.93752 10.499 3.93752C10.1884 3.93752 9.93652 4.18936 9.93652 4.50002H11.0615ZM5.64675 7.14777L7.89675 4.89777L7.1013 4.10227L4.8513 6.35227L5.64675 7.14777ZM6.93652 4.50002L6.93652 13.5H8.06152V4.50002H6.93652ZM12.3513 10.8523L10.1013 13.1023L10.8968 13.8977L13.1468 11.6477L12.3513 10.8523ZM11.0615 13.5L11.0615 4.50002H9.93652L9.93652 13.5H11.0615Z" fill="#616161" />
                    </svg>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {projects.map((project, index) => (
              <tr key={index} className="">
                <td className="px-5 py-3 text-sm text-[#616161]">{project.name}</td>
                <td className="px-5 py-3 text-sm text-[#616161]">${project.investment_amount.toFixed(2)}</td>
                <td className="px-5 py-3 text-sm text-[#616161]">
                  {project.profits !== null ? `$ ${project.profits.toFixed(2)}` : "---"}
                </td>
                <td className="px-5 py-3 text-sm">
                  <span className={`px-3 py-2 rounded-sm text-sm font-medium
                    ${project.status === 'Sold' ? 'bg-green-100 text-green-600' :
                      project.status === 'Pending' ? 'bg-gray-200 text-gray-600' :
                        'bg-orange-100 text-orange-500'}`}
                  >
                    {project.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserProjects;
