'use client'
import React, { useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import logo from '../../../../../public/client/logo.svg';
import Register from './register';
import { IoMdLogIn } from "react-icons/io";

export default function Menu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  const handleSignupClick = () => {
    setIsRegisterOpen(true);
    setIsMenuOpen(false);
  };

  return (
    <div className="box relative z-50 overflow-x-hidden w-full">
      <div className="w-full h-[100px] py-6 inline-flex justify-between items-center mx-auto px-4">
        <Link href="/">
          <Image src={logo} alt="logo" width={182} height={64} className="w-[182px] h-16 cursor-pointer hover:opacity-80 transition-opacity" />
        </Link>
        
        {/* Hamburger Menu Button - Only visible on mobile */}
        <button 
          className="lg:hidden flex flex-col justify-center items-center gap-1.5 z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className={`block w-6 h-0.5 bg-[#006198] transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-[#006198] transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-[#006198] transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex justify-start items-center gap-6">
          <Link 
            href="/admin-login"
            className="group relative h-11 w-11 bg-[#006198] rounded-lg flex justify-center items-center cursor-pointer hover:bg-[#004d7a] transition-colors"
          >
            <IoMdLogIn className="text-white text-2xl" />
            <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 top-1/2 -translate-y-1/2 right-full mr-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-md whitespace-nowrap">
              Dashboard
            </div>
          </Link>
          <Link 
            href="/client/submit-event"
            className="h-11 px-6 py-2 bg-[#006198] rounded-lg flex justify-center items-center gap-2 cursor-pointer hover:bg-[#004d7a] transition-colors"
          >
            <div className="text-center justify-start text-white text-lg font-medium font-['Inter'] leading-[28.80px]">Submit your Event</div>
          </Link>
          <div 
            onClick={handleSignupClick}
            className="h-11 px-6 py-2 bg-[#006198] rounded-lg flex justify-center items-center gap-2 cursor-pointer hover:bg-[#004d7a] transition-colors"
          >
            <div className="text-center justify-start text-white text-lg font-medium font-['Inter'] leading-[28.80px]">Register</div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`lg:hidden fixed top-[100px] left-0 right-0 bg-white shadow-lg transition-all duration-300 ease-in-out z-50 ${
            isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}
        >
          <div className="flex flex-col p-4 gap-4">
            <Link 
              href="/admin-login"
              className="group relative h-11 w-11 mx-auto bg-[#006198] rounded-lg flex justify-center items-center cursor-pointer hover:bg-[#004d7a] transition-colors"
              onClick={handleMenuItemClick}
            >
              <IoMdLogIn className="text-white text-2xl" />
              <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 top-1/2 -translate-y-1/2 right-full mr-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-md whitespace-nowrap">
                Dashboard
              </div>
            </Link>
            <Link 
              href="/client/submit-event"
              className="h-11 bg-[#006198] rounded-lg flex justify-center items-center cursor-pointer hover:bg-[#004d7a] transition-colors"
              onClick={handleMenuItemClick}
            >
              <div className="text-center text-white text-lg font-medium font-['Inter'] leading-[28.80px]">Submit your Event</div>
            </Link>
            <div 
              onClick={handleSignupClick}
              className="h-11 bg-[#006198] rounded-lg flex justify-center items-center cursor-pointer hover:bg-[#004d7a] transition-colors"
            >
              <div className="text-center text-white text-lg font-medium font-['Inter'] leading-[28.80px]">Register</div>
            </div>
          </div>
        </div>
      </div>

      {/* Register Modal */}
      <Register 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
      />
    </div>
  )
}
