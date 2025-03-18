import React from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";

const Profile = () => {
  return (
    <div className="w-64 bg-gray-900 text-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center gap-3">
        <img
          src="/profile.jpg" 
          alt="User Avatar"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold">Jenny Wilson</p>
          <p className="text-xs text-gray-400">jen.wilson@fgs.com</p>
        </div>
        <FiSettings className="text-gray-400 cursor-pointer hover:text-gray-200" size={18} />
      </div>

      <button className="w-full mt-4 flex items-center justify-center gap-2 bg-gray-700 text-gray-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 hover:text-white transition">
        <IoLogOutOutline size={16} />
        Logout
      </button>
    </div>
  );
};

export default Profile;
