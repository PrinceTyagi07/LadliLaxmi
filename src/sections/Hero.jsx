import React from 'react';
import { useNavigate } from 'react-router-dom';
const Hero = () => {
  const navigate = useNavigate();
  return (
    <section id="home" className="relative w-full h-screen flex items-center justify-center bg-gray-600 text-white overflow-hidden">
      {/* Background overlay for text readability */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      <div className="z-10 text-center max-w-4xl mx-auto p-4 md:p-8">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
          WELCOME TO <span className="text-green-500">LADLI</span><span className="text-amber-600">LAKSHMI</span>
        </h1>
        <p className="text-xl md:text-2xl mb-4">
          Help today because tomorrow you may be the one who needs helping!
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button onClick={() => navigate("/account")} className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
            LOGIN
          </button>
          <button onClick={() => navigate("/account")} className="px-8 py-3 bg-white hover:bg-gray-200 text-gray-900 font-bold rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
            REGISTER
          </button>
        </div>
      </div>

      
    </section>
  );
};

export default Hero;
