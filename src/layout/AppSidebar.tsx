
"use client";
import React, { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { ChevronDownIcon, GridIcon, HorizontaLDots } from "../icons/index";
import Profile from "@/components/Profile";
import { useSelector } from "react-redux";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
  roles?: string[];
};

const navItems: NavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/dashboard", roles: ["admin"] },
  { icon: <GridIcon />, name: "All Leads", path: "/dashboard/leads", roles: ["admin"] },
  { icon: <GridIcon />, name: "Accounts", path: "/dashboard/accounts", roles: ["admin"] },
  {
    icon: <GridIcon />,
    name: "Inventory",
    subItems: [{ name: "All Inventory", path: "/dashboard/inventory" }],
    roles: ["admin"],
  },
  { icon: <GridIcon />, name: "Dashboard", path: "/investor-dashboard", roles: ["investor"] },
  { icon: <GridIcon />, name: "Investment Opportunities", path: "/investor-dashboard/investment-opportunities", roles: ["investor"] },
  { icon: <GridIcon />, name: "My Investment", path: "/investor-dashboard/my-investment", roles: ["investor"] },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const userRole = useSelector((state: any) => state?.user?.user?.account_type);
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

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 left-0 bg-[#222222] lg:opacity-[96%] dark:bg-gray-900 dark:border-gray-400 text-white h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[240px]" : isHovered ? "w-[240px]" : "w-[90px]"} 
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="py-4 px-4 lg:flex hidden border-b border-[#ffffff1a] pb-5 mb-5">
        <Link href="/">
          <Image src="/images/logo/logo.svg" alt="Logo" width={isExpanded || isHovered || isMobileOpen ? 200 : 32} height={40} />
        </Link>
      </div>
      <div className="relative flex flex-col h-screen overflow-y-auto duration-300 ease-linear no-scrollbar justify-between">
        <nav className="mb-6">
          <h2 className="mb-4 text-xs pl-[15px] hidden uppercase font-semibold lg:flex text-gray-400">
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
                    <span className="menu-item-text font-semibold">{nav.name}</span>
                  </Link>
                ) : (
                  <>
                    <button
                      className={`w-full flex items-center justify-between px-6 py-2 font-semibold ${isActive(undefined, nav.subItems) ? "menu-item-active" : "menu-item-inactive"
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
          {isExpanded || isHovered || isMobileOpen ? <Profile /> : null}
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;