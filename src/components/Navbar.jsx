import React, { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { jwtDecode } from "jwt-decode";
import {useToken} from "../hooks/usetoken"
import { FaUserTie } from "react-icons/fa";
const Navbar = () => {

    const navigate = useNavigate(); // Call useNavigate at the top level
    const token = useToken();
  let user = null;

  if (token) {
    try {
      user = jwtDecode(token);
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("token");
    }
  }

  const navItem = [
    { link: "HOME", path: "home" },
    { link: "ABOUT", path: "about" },
    { link: "OUR MISSIONS", path: "missions" },
    { link: "SERVICES", path: "services" },
    { link: "Contact", path: "contact" },
    { link: "FAQ", path: "faq" },
  ];
  return (
    
    <nav className="flex  z-100 sticky bg-[#06091b]  border-b-2 border-gray-600 top-0 left-0  justify-between items-center p-2 text-amber-100 ">
      {/* Navbar content goes here */}
      <div className=" shadow shadow-amber-600 rounded-lg px-2 flex items-center space-x-2 justify-center">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-amber-500 "
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <p className="text-xl">Ladli Lakshmi</p>
      </div>

      {/* Desktop Navigation */}
      <ul className="hidden lg:flex space-x-6">
        {navItem.map((item, index) => (
          <li key={index}>
            <ScrollLink
              to={item.path}
              spy={true}
              smooth={true}
              offset={-100}
              duration={500}
              className="cursor-pointer text-lg font-medium hover:text-amber-600 transition"
              onClick={() => navigate("/")}
            >
              {item.link}
            </ScrollLink>
          </li>
        ))}
      </ul>



      <div className="flex space-x-6 cursor-pointer text-lg font-medium hover:text-amber-600 transition">
        
        
        <button className=" px-2 border-none w-[3vw] h-[3vw] shadow-amber-300" type="button"
        onClick={() => navigate(user ? "/userdashboard" : "/account")}>
          {user ?<span className="items-center justify-center flex flex-col"> <FaUserTie/> <span  className="text-sm"> profile</span></span> : "Register / Login"}
        </button>
        
      </div>
    </nav>
  );
};

export default Navbar;
