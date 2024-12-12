import React from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="flex items-center w-full sm:w-72 md:w-80 px-4 py-2 sm:py-1 bg-slate-100 rounded-md">
      <input 
        type="text"
        placeholder="Search Story"
        className="w-full text-xs sm:text-sm md:text-base bg-transparent py-1 outline-none"
        value={value}
        onChange={onChange}
      />

      {value && (
        <IoMdClose 
          className="text-xl sm:text-2xl text-slate-500 cursor-pointer hover:text-black mr-3"
          onClick={onClearSearch}
        />
      )}

      <FaMagnifyingGlass 
        className="text-slate-400 cursor-pointer hover:text-black text-sm sm:text-xl md:text-xl"
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
