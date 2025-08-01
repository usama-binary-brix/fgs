
"use client";
import React, { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { ChevronDownIcon, GridIcon, HorizontaLDots } from "../icons/index";
import { useSelector } from "react-redux";
import AdminProfile from "@/components/AdminProfile";
import { isRouteAllowed } from "@/lib/routes";


type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
  roles?: string[];
  count?: any;
};

const navItems: NavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/dashboard", roles: ["admin", 'super_admin'] },
  { icon: <GridIcon />, name: "Accounts", path: "/dashboard/accounts", roles: ["admin", 'super_admin'] },
  { icon: <GridIcon />, name: "All Inventory", path: "/dashboard/inventory", roles: ["admin", 'super_admin'] },
  {
    icon: <GridIcon />,
    name: "Leads",
    subItems: [{ name: "All Leads", path: "/dashboard/leads" }, { name: "Investor Leads", path: "/dashboard/investor-leads" }, { name: "Customer Leads", path: "/dashboard/customer-leads" }],
    roles: ["admin", 'super_admin'],
  },

  { icon: <GridIcon />, name: "Shipments", path: "/dashboard/shipments/all-shipments", roles: ["admin", 'super_admin'] },

  {
    icon: <GridIcon />,
    name: "Notifications",
    path: "/dashboard/admin-notifications",
    roles: ["admin", 'super_admin'],

  },

  { icon: <GridIcon />, name: "Dashboard", path: "/investor-dashboard", roles: ["investor"] },
  { icon: <GridIcon />, name: "Investment Opportunities", path: "/investor-dashboard/investment-opportunities", roles: ["investor"] },
  { icon: <GridIcon />, name: "My Investment", path: "/investor-dashboard/my-investment", roles: ["investor"] },

  {
    icon: <GridIcon />,
    name: "Notifications",
    path: "/investor-dashboard/notifications",
    roles: ['investor'],

  },

  {
    icon: <GridIcon />,
    name: "Leads",
    subItems: [{ name: "All Leads", path: "/sales-dashboard/leads" }, { name: "Investor Leads", path: "/sales-dashboard/investor-leads" }, { name: "Customer Leads", path: "/sales-dashboard/customer-leads" }],
    roles: ['salesperson'],
  },
  {
    icon: <GridIcon />,
    name: "Notifications",
    path: "/sales-dashboard/notifications",
    roles: ['salesperson'],

  },


  { icon: <GridIcon />, name: "Dashboard", path: "/broker-dashboard", roles: ["broker"] },
  {
    icon: <GridIcon />,
    name: "Shipment Opportunities",
    subItems: [
      { name: "All Shipments", path: "/broker-dashboard/shipments-opportunities/all-shipments" },
    ],
    roles: ["broker"],
  },
  {
    icon: <GridIcon />,
    name: "Notifications",
    path: "/broker-dashboard/notifications",
    roles: ['broker'],

  },
  { icon: <GridIcon />, name: "Dashboard", path: "/employee-dashboard", roles: ["employee"] },
  { icon: <GridIcon />, name: "Inventory Tasks", path: "/employee-dashboard/inventory-tasks", roles: ["employee"] },
  {
    icon: <GridIcon />,
    name: "Notifications",
    path: "/employee-dashboard/notifications",
    roles: ['employee'],

  },

];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, setIsMobileOpen } = useSidebar();
  const userRole = useSelector((state: any) => state?.user?.user?.account_type);
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const filteredNavItems = navItems.filter((item) => item.roles?.includes(userRole));

  // const filteredNavItems = navItems.filter((item) => {
  //   if (!userRole) return false;
  //   if (item.path && isRouteAllowed(item.path, userRole)) return true;
  //   if (item.subItems) {
  //     return item.subItems.some(sub => isRouteAllowed(sub.path, userRole));
  //   }
  //   return false;
  // });


  const handleLinkClick = () => {
    if (isMobileOpen) {
      setIsMobileOpen(false); // Close sidebar on mobile after clicking
    }
  };

  const isActive = useCallback(
    (path?: string, subItems?: { name: string; path: string }[]) => {
      if (!path && subItems) {
        return subItems.some((sub) => pathname === sub.path);
      }
      return pathname === path || (subItems && subItems.some((sub) => pathname === sub.path));
    },
    [pathname]
  );

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!userRole) return null; // or show a spinner


  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 left-0 bg-[#222222] lg:opacity-[100%] dark:bg-gray-900 dark:border-gray-400 text-white h-[calc(100vh-64px)] lg:h-screen transition-all duration-300 ease-in-out border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[240px]" : isHovered ? "w-[240px]" : "w-[90px]"} 
        ${isMobileOpen ? "z-[9999]" : "z-50"} 
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="py-4 px-4 lg:flex hidden border-b border-[#ffffff1a] pb-5 mb-5">
        <Image src="/images/logo/logo.svg" alt="Logo" width={isExpanded || isHovered || isMobileOpen ? 200 : 32} height={40} />
      </div>

      <div className="flex flex-col h-full overflow-hidden">
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">
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
                      onClick={handleLinkClick}
                      className={`menu-item pl-[25px] flex items-center justify-between ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}
                    >
                      <span className="menu-item-text font-medium">{nav.name}</span>
                      {nav.count && (
                        <span className="ml-2 bg-primary text-white text-xs rounded-full px-2 py-0.5">
                          {nav.count}
                        </span>
                      )}
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
                                onClick={handleLinkClick}
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
        </div>

        <div className="mt-auto border-t border-[#ffffff1a]">
          <AdminProfile />
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;