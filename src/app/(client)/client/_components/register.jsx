'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import bgimg from '../../../../../public/client/background.png';
import { useForm } from 'react-hook-form';
import RegisterApis from '../../../API/RegisterApi';
import { toast } from 'react-hot-toast';

export default function Register({ isOpen, onClose }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // match this with the CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await RegisterApis.createSubscription({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        companyName: data.companyName || '',
        jobTitle: data.jobTitle || ''
      });

      if (response.success) {
        toast.success('Registration successful!');
        reset(); // Reset the form fields
        onClose(); // Close the modal on successful submission
      } else {
        toast.error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Start the closing animation
    setIsAnimating(false);
    // Delay the actual closing to allow the animation to complete
    setTimeout(() => {
      onClose();
    }, 300); // match this with the CSS transition duration
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <>
      {/* Modal Overlay */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      >
        {/* Modal Content */}
        <div 
          className={`w-[80vw] max-w-[600px] p-8 bg-white rounded-[20px] shadow-[0px_39px_23px_-27px_rgba(0,0,0,0.10)] outline-1 outline-offset-[-1px] outline-[#dfe4ea] overflow-y-auto max-h-[90vh] transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          onClick={e => e.stopPropagation()}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-start items-start gap-[30px]">
            <div className="flex flex-col justify-start items-start gap-5">
              <div className="flex flex-col justify-start items-start gap-6">
                <div className="flex flex-col justify-start items-center gap-7">
                  <div className="flex flex-col justify-start items-start gap-[7px]">
                    <div className="justify-start text-[#1d1f2c] text-2xl sm:text-[32px] font-medium ">Register here for weekly event updates!</div>
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-start gap-[26px] flex-wrap content-start">
                  <div className="flex-1 h-20 inline-flex flex-col justify-start items-start gap-[5px]">
                    <div className="self-stretch flex-1 flex flex-col justify-start items-start gap-2.5">
                      <div className="w-[250px] inline-flex justify-start items-start gap-2.5">
                        <div className="justify-start text-[#1d1f2c] text-base font-medium ">First Name</div>
                      </div>
                      <input
                        {...register("firstName", { required: "First name is required" })}
                        className="self-stretch flex-1 pl-5 pr-4 py-3 bg-[#f2f7fa] rounded-md outline-1 outline-offset-[-1px] outline-[#006198]"
                        disabled={isLoading}
                      />
                      {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                    </div>
                  </div>
                  <div className="flex-1 h-20 inline-flex flex-col justify-start items-start gap-[5px]">
                    <div className="self-stretch flex-1 flex flex-col justify-start items-start gap-2.5">
                      <div className="w-[250px] inline-flex justify-start items-start gap-2.5">
                        <div className="justify-start text-[#1d1f2c] text-base font-medium ">Last Name</div>
                      </div>
                      <input
                        {...register("lastName", { required: "Last name is required" })}
                        className="self-stretch flex-1 pl-5 pr-4 py-3 bg-[#f2f7fa] rounded-md outline outline-1 outline-offset-[-1px] outline-[#006198]"
                        disabled={isLoading}
                      />
                      {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                    </div>
                  </div>
                  <div className="w-full h-20 inline-flex flex-col justify-start items-start gap-[5px]">
                    <div className="self-stretch flex-1 flex flex-col justify-start items-start gap-2.5">
                      <div className="w-[250px] inline-flex justify-start items-start gap-2.5">
                        <div className="justify-start text-[#1d1f2c] text-base font-medium ">Email Address</div>
                      </div>
                      <input
                        {...register("email", { 
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                          }
                        })}
                        className="self-stretch flex-1 pl-5 pr-4 py-3 bg-[#f2f7fa] rounded-md outline outline-1 outline-offset-[-1px] outline-[#006198]"
                        disabled={isLoading}
                      />
                      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div className="w-full h-[81px] inline-flex flex-col justify-start items-start gap-[5px]">
                    <div className="self-stretch flex-1 flex flex-col justify-start items-start gap-2.5">
                      <div className="w-[250px] inline-flex justify-start items-start gap-2.5">
                        <div className="justify-start text-[#1d1f2c] text-base font-medium ">Company Name</div>
                      </div>
                      <input
                        {...register("companyName")}
                        className="self-stretch flex-1 pl-5 pr-4 py-3 bg-[#f2f7fa] rounded-md outline outline-1 outline-offset-[-1px] outline-[#006198]"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="w-full h-20 inline-flex flex-col justify-start items-start gap-[5px]">
                    <div className="self-stretch flex-1 flex flex-col justify-start items-start gap-2.5">
                      <div className="w-[250px] inline-flex justify-start items-start gap-2.5">
                        <div className="justify-start text-[#1d1f2c] text-base font-medium ">Job Title</div>
                      </div>
                      <input
                        {...register("jobTitle")}
                        className="self-stretch flex-1 pl-5 pr-4 py-3 bg-[#f2f7fa] rounded-md outline outline-1 outline-offset-[-1px] outline-[#006198]"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-[214px] h-[50px] px-7 py-3 bg-[#006198] rounded-md inline-flex justify-center items-center gap-2.5 text-white text-base font-medium hover:bg-[#004d7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
