import React from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
import { useLogoutMutation } from "@/store/services/api";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Profile = () => {
  const [logout, { isLoading }] = useLogoutMutation();
const router = useRouter()
  const handleLogout = async () => {
    try {
      console.log('Logout successful before api ');

      await logout('').unwrap();
      console.log('Logout successful');
      router.push('/signin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNavigate = () => {
    router.push("/dashboard/leads/settings")
  }

  return (
    <div className="w-64 bg-gray-900 text-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center gap-3">
        <Image
        width={12}
        height={12}
          src="/profile.jpg" 
          alt="User Avatar"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold">Jenny Wilson</p>
          <p className="text-xs text-gray-400">jen.wilson@fgs.com</p>
        </div>
        <FiSettings onClick={handleNavigate}  className="text-gray-400 cursor-pointer hover:text-gray-200" size={18} />
      </div>
    
      <button onClick={handleLogout} disabled={isLoading} className="w-full mt-4 flex items-center justify-center gap-2 bg-gray-700 text-gray-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 hover:text-white transition">
        <IoLogOutOutline size={16} />
        {isLoading ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
};

export default Profile;
