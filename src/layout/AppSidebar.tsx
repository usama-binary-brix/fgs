
"use client";
import React, { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { ChevronDownIcon, GridIcon, HorizontaLDots } from "../icons/index";
import Profile from "@/components/Profile";
import { useSelector } from "react-redux";
import AdminProfile from "@/components/AdminProfile";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
  roles?: string[];
};

const navItems: NavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/dashboard", roles: ["admin", 'super_admin'] },
  { icon: <GridIcon />, name: "All Leads", path: "/dashboard/leads", roles: ["admin", 'super_admin'] },
  { icon: <GridIcon />, name: "Accounts", path: "/dashboard/accounts", roles: ["admin", 'super_admin'] },
  {
    icon: <GridIcon />,
    name: "Inventory",
    subItems: [{ name: "All Inventory", path: "/dashboard/inventory" }],
    roles: ["admin", 'super_admin'],
  },

  { icon: <GridIcon />, name: "Dashboard", path: "/investor-dashboard", roles: ["investor"] },
  { icon: <GridIcon />, name: "Investment Opportunities", path: "/investor-dashboard/investment-opportunities", roles: ["investor"] },
  { icon: <GridIcon />, name: "My Investment", path: "/investor-dashboard/my-investment", roles: ["investor"] },


  { icon: <GridIcon />, name: "Dashboard", path: "/sales-dashboard", roles: ["salesperson"] },
  { icon: <GridIcon />, name: "All Leads", path: "/sales-dashboard/leads", roles: ["salesperson"] },

  { icon: <GridIcon />, name: "Dashboard", path: "/broker-dashboard", roles: ["broker"] },
  {
    icon: <GridIcon />,
    name: "Shipment Opportunities",
    subItems: [
      { name: "All Shipments", path: "/broker-dashboard/shipments-opportunities/all-shipments" },
      {name: "New Shipments", path: "/dashborad/inventory"},
      {name: "Accepted/InProgress Shipments", path: "/dashborad/inventory"},
      {name: "Archived Shipments", path: "/dashborad/inventory"},
    ],
    roles: ["broker"],
  },


  { icon: <GridIcon />, name: "Dashboard", path: "/employee-dashboard", roles: ["employee"] },
  {
    icon: <GridIcon />,
    name: "Inventory Tasks",
    subItems: [
      { name: "All Inventory Tasks", path: "/employee-dashboard/inventory-tasks" },
      {name: "With Active Tasks", path: "/employee-dashboard/active-tasks"},
      {name: "With Completed Tasks", path: "/employee-dashboard/completed-tasks"},
    ],
    roles: ["employee"],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const userRole = useSelector((state: any) => state?.user?.user?.account_type);
  // const userRole = 'broker'
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const filteredNavItems = navItems.filter((item) => item.roles?.includes(userRole));

  const isActive = useCallback(
    (path?: string, subItems?: { name: string; path: string }[]) => {
      if (!path && subItems) {
        return subItems.some((sub) => pathname === sub.path);
      }
      return pathname === path || (subItems && subItems.some((sub) => pathname === sub.path));
    },
    [pathname]
  );
  // const isActive = useCallback(
  //   (path?: string, subItems?: { name: string; path: string }[]) => {
  //     if (path && pathname.startsWith(path)) {
  //       return true;
  //     }
  //     if (subItems) {
  //       return subItems.some((sub) => pathname.startsWith(sub.path));
  //     }
  //     return false;
  //   },
  //   [pathname]
  // );
  
  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 left-0 bg-[#222222] lg:opacity-[100%] dark:bg-gray-900 dark:border-gray-400 text-white h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[240px]" : isHovered ? "w-[240px]" : "w-[90px]"} 
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="py-4 px-4 lg:flex hidden border-b border-[#ffffff1a] pb-5 mb-5">
        <Image src="/images/logo/logo.svg" alt="Logo" width={isExpanded || isHovered || isMobileOpen ? 200 : 32} height={40} />

      </div>
      <div className="relative flex flex-col h-screen overflow-y-auto duration-300 ease-linear no-scrollbar justify-between">
        <nav className="mb-6">
          <h2 className="mb-4 text-[14px] tracking-widest pl-[15px] hidden uppercase font-medium lg:flex text-gray-400">
            {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots />}
          </h2>
          <ul className="flex flex-col">
            {filteredNavItems.map((nav) => (
              <li key={nav.name} className="font-semibold">
                {nav.path ? (
                  <Link
                    href={nav.path}
                    className={`menu-item pl-[25px] ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}
                  >
                    <span className="menu-item-text font-medium">{nav.name}</span>
                  </Link>
                ) : (
                  <>
                    <button
                      className={`w-full flex items-center justify-between px-6 font-medium py-2 text-sm ${isActive(undefined, nav.subItems) ? "menu-item-active" : "menu-item-inactive"
                        }`}
                      onClick={() => toggleMenu(nav.name)}
                    >
                      <span>{nav.name}</span>
                      <ChevronDownIcon className={`transition-transform ${openMenus[nav.name] ? "rotate-180" : ""}`} />
                    </button>

                    {openMenus[nav.name] && (
                      <ul className="bg-[#FFFFFF14]">
                        {nav.subItems?.map((sub) => (
                          <li key={sub.name} className="">
                            <Link
                              href={sub.path}
                              className={`pl-10 menu-item ${isActive(sub.path) ? "menu-sub-item-active" : "menu-item-inactive"}`}
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-15 lg:bottom-0 w-full">
          {/* {(isExpanded || isHovered || isMobileOpen) &&
    (userRole === "admin" ? <AdminProfile /> : <Profile />)} */}
          <AdminProfile />
        </div>

      </div>
    </aside>
  );
};

export default AppSidebar;