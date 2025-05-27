import React from "react";
// Assuming lucide-react is available for icons, similar to previous components
// If not, you might need to add a script tag for lucide-react in your index.html
// <script src="https://unpkg.com/lucide-react@latest/dist/umd/lucide-react.min.js"></script>
// For direct use in React, you'd typically install it: npm install lucide-react
// For this environment, we'll use inline SVGs as a fallback or if lucide-react isn't directly importable.

const Contact = () => {
  return (
    <section
      
      className="w-full bg-gray-100 py-16 px-4 sm:px-6 lg:px-8 font-sans antialiased"
    >
      <div id="contact" className="max-w-7xl  mx-auto grid lg:grid-cols-2 grid-cols-1 gap-12 items-center">
        {/* Contact Form Section */}
        <div className="bg-white rounded-2xl p-8 md:p-12 lg:p-16 flex flex-col justify-center items-center shadow-xl">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
            Send us a message today
          </h2>
          <form className="w-full space-y-6">
            <input
              type="text"
              placeholder="Enter your full name here"
              className="text-black  w-full px-6 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-amber-500 transition duration-300"
            />

            <input
              type="email"
              placeholder="Enter your valid Email"
              className="text-black w-full px-6 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-amber-500 transition duration-300"
            />

            <input
              type="tel" // Changed to tel for phone numbers
              placeholder="Enter your valid mobile number"
              className="text-black w-full px-6 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-amber-500 transition duration-300"
            />

            <textarea
              name="message"
              className="text-black w-full px-6 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-amber-500 transition duration-300"
              rows="5"
              placeholder="Enter your message here..."
            ></textarea>
            <button
              type="submit" // Changed to submit for form submission
              className="w-full px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              SEND MESSAGE
            </button>
          </form>
        </div>

        {/* Contact Information Section */}
        <div className="flex flex-col justify-center items-start lg:p-12 p-6 text-gray-700">
          <h3 className="text-xl font-semibold text-amber-600 mb-4">
            REACH US
          </h3>
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 mb-8">
            Get in touch with us for any inquiries or support.
          </h2>
          <p className="text-lg leading-relaxed mb-8">
            We are here to help and answer any question you might have. We look
            forward to hearing from you.
          </p>

          <div className="space-y-6 w-full">
            {/* Phone Number */}
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 p-3 bg-amber-100 text-amber-600 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <p className="text-lg text-gray-800">+1 (234) 567-8900</p>
            </div>

            {/* Email Address */}
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 p-3 bg-amber-100 text-amber-600 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </div>
              <p className="text-lg text-gray-800">info@ladlilakshmi.com</p>
            </div>

            {/* Address */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 p-3 bg-amber-100 text-amber-600 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin">
                  <path d="M12 18.3a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
                  <path d="M12 22s8-4 8-10a8 8 0 0 0-16 0c0 6 8 10 8 10Z"/>
                </svg>
              </div>
              <p className="text-lg text-gray-800">
                123 Trust Lane, Philanthropy City, State 12345, Country
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
