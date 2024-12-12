import React from 'react';
import { getInitials } from '../../utils/helper';

const ProfileInfo = ({ userInfo, onLogout }) => {
  return (
    userInfo && (
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Avatar Section */}
        <div className="w-9 h-9 sm:w-14 sm:h-14 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
          {getInitials(userInfo ? userInfo.fullName : "")}
        </div>

        {/* User Info Section */}
        <div className=' mr-[-10px] flex flex-col items-start'>
          <p className="text-xs sm:text-base md:text-lg font-medium text-slate-700 ">
            {userInfo?.fullName || ""}
          </p>
          <button
            className="text-xs sm:text-sm text-slate-700 underline hover:text-black "
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    )
  );
};

export default ProfileInfo;
