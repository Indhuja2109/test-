import React from "react";
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { BASE_URL } from '../../utils/constants';
import axios from "axios"; // Import axios

const Navbar = ({
  userInfo,
  searchQuery,
  setSearchQuery,
  onSearchNote,
  handleClearSearch,
}) => {
  const isToken = localStorage.getItem("token");
  const navigate = useNavigate();

  const onLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      // Send a logout request to the backend
      await axios.post(
        `${BASE_URL}/logout`,
        {}, // Add body data if necessary (e.g., { token })
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token to backend
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Logout successful on the server.");
    } catch (error) {
      console.error("Server logout failed:", error.message);
    } finally {
      // Clear token from localStorage and redirect to login
      localStorage.removeItem("token");
      navigate("/login", { replace: true }); // Make sure this happens after logout
    }
  };

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    handleClearSearch();
    setSearchQuery("");
  };

  return (
    <div className="bg-white flex items-center justify-between px-4 py-2 drop-shadow top-0 z-10 sm:px-6 md:px-8 lg:px-10">
      <h1 className="text-cyan-500 font-pacifico text-base sm:text-xl md:text-2xl lg:text-3xl">
        Travel Story
      </h1>

      {isToken && (
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
          <SearchBar
            value={searchQuery}
            onChange={({ target }) => {
              setSearchQuery(target.value);
            }}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
