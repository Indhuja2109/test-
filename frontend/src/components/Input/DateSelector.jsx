import React, { useState } from "react";
import { MdOutlineDateRange, MdClose } from "react-icons/md";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import "react-day-picker/dist/style.css";

const DateSelector = ({ date, setDate }) => {
  const [openDatePicker, setOpenDatePicker] = useState(false);

  // Handle date selection
  const handleDateSelect = (selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      setOpenDatePicker(false); // Close on selection
    }
  };

  // Close the date picker when clicked outside
  const handleOutsideClick = (e) => {
    e.stopPropagation();
    setOpenDatePicker(false);
  };

  return (
    <div className="w-full relative">
      {/* Button to open the date picker */}
      <button
        className="inline-flex items-center gap-2 
                   text-[13px] md:text-[15px] lg:text-[15px] 
                   font-medium text-sky-500 bg-cyan-50 
                   hover:bg-cyan-400 hover:text-white rounded 
                   px-2 md:px-3 lg:px-4 py-1 cursor-pointer"
        onClick={() => setOpenDatePicker(true)}
      >
        <MdOutlineDateRange className="text-lg md:text-xl" />
        {date
          ? moment(date).format("Do MMM YYYY")
          : moment().format("Do MMM YYYY")}
      </button>

      {/* Date Picker Popup */}
      {openDatePicker && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 z-50 flex justify-center items-center"
          onClick={handleOutsideClick} // Close on outside click
        >
          <div
            className="relative bg-white rounded-lg shadow-lg p-4 w-full max-w-sm pointer-events-auto"
            onClick={(e) => e.stopPropagation()} // Prevent closing when interacting with DayPicker
          >
            {/* Close Button
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center 
                         bg-gray-200 hover:bg-gray-300 absolute top-2 right-2"
              onClick={() => setOpenDatePicker(false)}
            >
              <MdClose className="text-lg md:text-xl text-gray-600" />
            </button> */}

            {/* Day Picker */}
            <div className="overflow-y-auto max-h-96 pointer-events-auto">
              <DayPicker
                captionLayout="dropdown-buttons"
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                pagedNavigation
                className="text-xs sm:text-sm md:text-base"
                onTouchStart={(e) => e.stopPropagation()} // Stop touch conflict
                onTouchMove={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateSelector;
