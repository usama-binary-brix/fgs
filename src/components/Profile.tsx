import React, { useState } from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
import { useLogoutMutation } from "@/store/services/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSelector } from "react-redux";

const Profile = () => {
  const [logout, { isLoading }] = useLogoutMutation();
  const router = useRouter()
  const user = useSelector((state: any) => state?.user?.user)
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {

      await logout('').unwrap();
      console.log('Logout successful');
      router.push('/signin');
      setLoading(false)

    } catch (error) {
      console.error('Logout error:', error);
      setLoading(false)

    }
  };

  const handleNavigate = () => {
    router.push("/dashboard/settings")
  }

  return (
    <div className="w-[289.5px] bg-[#222222] text-white p-4 pt-4 border-t border-[#ffffff1a] shadow-lg">
      <h1 className="pb-5 font-semibold !font-family text-[10px] text-white opacity-[0.5]">PROFILE</h1>
      <div className="flex items-center justify-between">

      <div className="flex items-center gap-3">
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
    className="w-12 h-12 rounded-full bg-gray-500 text-white p-2"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
  </svg>
)}

        <div>
          <p className="text-sm font-semibold font-family">{user?.first_name} {user?.last_name}</p>
          <p className="text-xs text-gray-400 font-family">{user?.email}</p>
        </div>

      </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 20 20" fill="none">
          <path d="M6.5359 3.16826C8.2265 2.16709 9.07183 1.6665 10 1.6665C10.9282 1.6665 11.7735 2.16709 13.4641 3.16826L14.0359 3.50689C15.7265 4.50806 16.5718 5.00865 17.0359 5.83317C17.5 6.6577 17.5 7.65887 17.5 9.66125V10.3384C17.5 12.3408 17.5 13.342 17.0359 14.1665C16.5718 14.991 15.7265 15.4916 14.0359 16.4928L13.4641 16.8314C11.7735 17.8326 10.9282 18.3332 10 18.3332C9.07183 18.3332 8.2265 17.8326 6.5359 16.8314L5.9641 16.4928C4.2735 15.4916 3.4282 14.991 2.9641 14.1665C2.5 13.342 2.5 12.3408 2.5 10.3384V9.66125C2.5 7.65887 2.5 6.6577 2.9641 5.83317C3.4282 5.00865 4.2735 4.50806 5.9641 3.50689L6.5359 3.16826Z" stroke="white" strokeOpacity="0.5" strokeWidth="1.25" />
          <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="white" strokeOpacity="0.5" strokeWidth="1.25" />
        </svg>
        {/* <FiSettings onClick={handleNavigate}  className="text-gray-400 cursor-pointer hover:text-gray-200" size={18} /> */}
      </div>

      <button onClick={handleLogout} disabled={isLoading} className="w-full mt-4 flex items-center justify-center gap-2 bg-[#333] text-gray-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 hover:text-white transition">
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

export default Profile;
