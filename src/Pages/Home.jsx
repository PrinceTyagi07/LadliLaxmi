import React from "react";
import Hero from "../sections/Hero";
import Services from "../sections/Services";
import Mission from "../sections/Mission";
import Contact from "../sections/Contact";
import { useState , useEffect } from "react";
import About from "../sections/About";
import FAQ from "../sections/FAQ";

const Home = ({role}) => {
  
  return (
    <div className="m-0">
      {
        role === "user" ? (<Hero  role={role} />):("")
      }
        
        <About />
        <Mission />
        <Services />
        <Contact />
        <FAQ />
    </div>
  );
};

export default Home;
