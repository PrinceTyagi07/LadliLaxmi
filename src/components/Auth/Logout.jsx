// Logout.js (Separate Component)
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/v1/auth/logout", {
        method: "POST", // Or POST
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (response.ok) {
        // Remove token from cookies
        Cookies.remove("cookie");

        // Remove token from local storage
        localStorage.removeItem("token");

        // Redirect to home page after logout
        navigate("/");

        console.log("Logout successful");
      } else {
        const data = await response.json();
        console.error("Logout failed:", data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className=" text-xl shadow-2xl shadow-red-900 bg-red-100 rounded-md mb-2 text-red-500 font-semibold transition-transform duration-200 hover:scale-90 active:scale-120"
    >
      Logout
    </button>
  );
};

export default Logout;