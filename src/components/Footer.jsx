import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800  text-white py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Company Info */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <h3 className="text-2xl font-bold text-white mb-4">Ladli Lakshmi Janhit Trust</h3>
                    <p className="text-gray-400 leading-relaxed mb-4">
                        Dedicated to serving our community through innovative solutions and unwavering commitment.
                    </p>
                    <p className="text-gray-400">&copy; {new Date().getFullYear()} Ladli Lakshmi Janhit Trust. All rights reserved.</p>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <h4 className="text-xl font-semibold text-white mb-4">Quick Links</h4>
                    <ul className="space-y-2">
                        <li><a href="#" className="text-gray-400 hover:text-rose-500 transition duration-300">Home</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-rose-500 transition duration-300">About Us</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-rose-500 transition duration-300">Services</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-rose-500 transition duration-300">FAQ</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-rose-500 transition duration-300">Contact</a></li>
                    </ul>
                </div>

                {/* Contact & Social Media */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <h4 className="text-xl font-semibold text-white mb-4">Connect With Us</h4>
                    <div className="space-y-2 mb-4">
                        <p className="text-gray-400 flex items-center justify-center md:justify-start">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone mr-2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                            </svg>
                            +1 (234) 567-8900
                        </p>
                        <p className="text-gray-400 flex items-center justify-center md:justify-start">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail mr-2">
                                <rect width="20" height="16" x="2" y="4" rx="2"/>
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                            </svg>
                            info@ladlilakshmi.com
                        </p>
                        <p className="text-gray-400 flex items-start justify-center md:justify-start">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin mr-2 mt-1">
                                <path d="M12 18.3a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
                                <path d="M12 22s8-4 8-10a8 8 0 0 0-16 0c0 6 8 10 8 10Z"/>
                            </svg>
                            123 Trust Lane, Philanthropy City, State 12345, Country
                        </p>
                    </div>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-rose-500 transition duration-300">
                            {/* Facebook Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="lucide lucide-facebook">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                            </svg>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-rose-500 transition duration-300">
                            {/* Twitter Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="lucide lucide-twitter">
                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.7 5 4.9 8 5.1-1-3.7 3-7.5 7-7.5 2.1 0 3.6.9 4.3 1.7Z"/>
                            </svg>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-rose-500 transition duration-300">
                            {/* Instagram Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="lucide lucide-instagram">
                                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                <line x1="17.5" x2="17.5" y1="6.5" y2="6.5"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
