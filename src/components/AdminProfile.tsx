import React, { useState } from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
import { useLogoutMutation } from "@/store/services/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { clearUser } from "@/store/services/userSlice";

const AdminProfile = () => {
  const [logout, { isLoading }] = useLogoutMutation();
  const router = useRouter()
  const user = useSelector((state: any) => state?.user?.user)
  const [loading, setLoading] = useState(false)
const dispatch = useDispatch()

  const handleLogout = async () => {
    setLoading(true)
    try {

      await logout('').unwrap();
      router.push('/signin');
      setTimeout(() => {
        dispatch(clearUser());
      }, 100); 

      setLoading(false)

    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Please try again')
      setLoading(false)

    }
  };

  const handleNavigate = () => {
    if (user?.account_type === 'super_admin' || user?.account_type === 'admin') {
      router.push("/dashboard/settings");
    } else if (user?.account_type === 'salesperson') {
      router.push("/sales-dashboard/settings");
    }
    else if (user?.account_type === 'broker') {
      router.push("/broker-dashboard/settings");
    }  else if (user?.account_type === 'employee') {
      router.push("/employee-dashboard/settings");
    } else if (user?.account_type === 'investor') {
      router.push("/investor-dashboard/settings");
    }
  };

  return (
    <div className="w-[239.5px] bg-[#222222] text-white p-4   pt-4 border-t border-[#ffffff1a] shadow-lg">
      <h1 className="pb-[0.9rem] font-semibold uppercase !font-family text-[10px] text-white opacity-[0.5]">PROFILE</h1>
      <div className="flex items-center justify-between">

      <div className="flex items-center gap-[0.65rem]">
      {user?.profileImage ? (
  <Image
    width={12}
    height={12}
    src={user.profileImage}
    alt="User Profile"
    className="w-12 h-12 rounded-full object-cover"
  />
) : (
  <svg
    className="w-10 h-10 rounded-full bg-gray-500 text-white p-2"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
  </svg>
)}

        <div>
          <p className="text-[13px]  capitalize font-normal font-family mb-[1.5px]">{user?.first_name} {user?.last_name}</p>
          <p className="text-[11px] text-[#fff] opacity-[70%] font-normal font-family">{user?.email}</p>
        </div>

      </div>
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={handleNavigate} className="cursor-pointer">
<path d="M9.5359 6.16875C11.2265 5.16758 12.0718 4.66699 13 4.66699C13.9282 4.66699 14.7735 5.16758 16.4641 6.16875L17.0359 6.50738C18.7265 7.50855 19.5718 8.00913 20.0359 8.83366C20.5 9.65818 20.5 10.6594 20.5 12.6617V13.3389C20.5 15.3413 20.5 16.3425 20.0359 17.167C19.5718 17.9915 18.7265 18.4921 17.0359 19.4932L16.4641 19.8319C14.7735 20.8331 13.9282 21.3337 13 21.3337C12.0718 21.3337 11.2265 20.8331 9.5359 19.8319L8.9641 19.4932C7.2735 18.4921 6.4282 17.9915 5.9641 17.167C5.5 16.3425 5.5 15.3413 5.5 13.3389V12.6617C5.5 10.6594 5.5 9.65818 5.9641 8.83366C6.4282 8.00913 7.2735 7.50855 8.9641 6.50738L9.5359 6.16875Z" stroke="white" strokeOpacity="0.5" strokeWidth="1.25"/>
<path d="M13 15.5C14.3807 15.5 15.5 14.3807 15.5 13C15.5 11.6193 14.3807 10.5 13 10.5C11.6193 10.5 10.5 11.6193 10.5 13C10.5 14.3807 11.6193 15.5 13 15.5Z" stroke="white" strokeOpacity="0.5" strokeWidth="1.25"/>
</svg>

        {/* <FiSettings onClick={handleNavigate}  className="text-gray-400 cursor-pointer hover:text-gray-200" size={18} /> */}
      </div>

      <button onClick={handleLogout} disabled={isLoading} className="w-full mt-[1.25rem] mb-5 flex items-center justify-center gap-2 bg-[#333] text-gray-400 px-4 py-2 rounded-sm text-sm font-medium hover:bg-gray-600 hover:text-white transition">
        {/* <IoLogOutOutline size={16} /> */}
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M9.99959 16.6668C13.6815 16.6668 16.6663 13.6821 16.6663 10.0002C16.6663 6.31826 13.6815 3.3335 9.99959 3.3335" stroke="white" strokeOpacity="0.4" strokeWidth="1.25" strokeLinecap="round" />
          <path d="M11.6663 10H3.33293M3.33293 10L5.83293 7.5M3.33293 10L5.83293 12.5" stroke="white" strokeOpacity="0.4" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {isLoading ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
};

export default AdminProfile;
