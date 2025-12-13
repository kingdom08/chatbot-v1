import React from "react";
import LogOut from "./Logout";
import { CiLogout } from "react-icons/ci";

const Navbar = ({ onLogoutClick }) => {
  return (
    <>
      <div className=" fixed top-0 w-[calc(100%-16rem)] bg-white  z-20 left-64 h-[75px]  flex justify-between items-center px-10   shadow p-6">
        <span
          className="font-bold text-xl text-gray-600
        "
        >
          Bimbingan Akademik
        </span>

        <button
          onClick={onLogoutClick}
          className="flex items-center p-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors   border-gray-200"
        >
          <CiLogout size={20} className="mr-3" />
          <span>Keluar</span>
        </button>
      </div>
    </>
  );
};

export default Navbar;
