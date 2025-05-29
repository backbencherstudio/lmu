import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "../../../../../public/client/logo.svg";
import events from "../../../../../public/client/events.svg";
import subscriber from "../../../../../public/client/subscriber.svg";
import { IoSearch, IoChevronForward, IoLogOutOutline, IoMailOutline, IoHomeOutline } from "react-icons/io5";
import AuthApis from "../../../API/AuthApi";

export default function Leftbar() {
  const pathname = usePathname();

  const handleLogout = () => {
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    
    // Use AuthApis logout which handles cookie removal and redirection
    AuthApis.logout();
  };

  return (
    <>
      <div className="py-6 px-5 w-full h-full flex flex-col">
        <Image
          src={logo}
          alt="logo"
          width={"100%"}
          height={"100%"}
          className="mb-5"
        />

        <div className="w-full mb-5">
          <div className="w-full">
            <div className="w-full px-3 py-2 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline-1 outline-offset-[-1px] outline-[#d5d6d9] flex justify-between items-center overflow-hidden">
              <div className="flex justify-start items-center gap-2">
                <IoSearch className="w-5 h-5 text-[#717680]" />
                <input
                  type="text"
                  placeholder="Search"
                  className="outline-none text-[#717680] text-base font-normal leading-normal"
                />
              </div>
              <div className="px-1 py-px rounded outline-1 outline-offset-[-1px] outline-[#e9e9eb] flex justify-start items-start">
                {/* <div className="justify-end text-[#717680] text-xs font-medium leading-[18px]">
                  ⌘ K
                </div> */}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="menu">
            <div data-current="True" data-open="False" className="h-11 ">
              <Link href="/dashboard">
                <div
                  data-badge="false"
                  data-current="True"
                  data-dot="false"
                  data-state="Default"
                  className="py-0.5 flex justify-start items-center overflow-hidden"
                >
                  <div className={`px-3 py-2 ${pathname === '/dashboard' ? 'bg-neutral-200' : 'bg-neutral-50'} rounded-md flex justify-between items-center w-full`}>
                    <div className="flex justify-start items-center gap-2">
                      <Image
                        src={events}
                        alt="events"
                        width={20}
                        height={20}
                        className="text-[#717680]"
                      />
                      <div className="justify-start text-[#252b37] text-base font-semibold leading-normal">
                        Events
                      </div>
                    </div>
                    <IoChevronForward className="w-4 h-4 text-[#a3a7ae] text-end" />
                  </div>
                </div>
              </Link>
            </div>
            <div data-current="True" data-open="False" className="h-11 ">
              <Link href="/dashboard/subscriber">
                <div
                  data-badge="false"
                  data-current="True"
                  data-dot="false"
                  data-state="Default"
                  className="py-0.5 flex justify-start items-center overflow-hidden"
                >
                  <div className={`px-3 py-2 ${pathname === '/dashboard/subscriber' ? 'bg-neutral-200' : 'bg-neutral-50'} rounded-md flex justify-between items-center w-full`}>
                    <div className="flex justify-start items-center gap-2">
                      <Image
                        src={subscriber}
                        alt="events"
                        width={20}
                        height={20}
                        className="text-[#717680]"
                      />
                      <div className="justify-start text-[#252b37] text-base font-semibold leading-normal">
                        Subscribers
                      </div>
                    </div>
                    <IoChevronForward className="w-4 h-4 text-[#a3a7ae] text-end" />
                  </div>
                </div>
              </Link>
            </div>
            <div data-current="True" data-open="False" className="h-11 ">
              <Link href="/dashboard/event-request">
                <div
                  data-badge="false"
                  data-current="True"
                  data-dot="false"
                  data-state="Default"
                  className="py-0.5 flex justify-start items-center overflow-hidden"
                >
                  <div className={`px-3 py-2 ${pathname === '/dashboard/event-request' ? 'bg-neutral-200' : 'bg-neutral-50'} rounded-md flex justify-between items-center w-full`}>
                    <div className="flex justify-start items-center gap-2">
                      <IoMailOutline className="w-5 h-5 text-[#717680]" />
                      <div className="justify-start text-[#252b37] text-base font-semibold leading-normal">
                        Event Request
                      </div>
                    </div>
                    <IoChevronForward className="w-4 h-4 text-[#a3a7ae] text-end" />
                  </div>
                </div>
              </Link>
            </div>
            <div data-current="True" data-open="False" className="h-11 ">
              <Link href="/">
                <div
                  data-badge="false"
                  data-current="True"
                  data-dot="false"
                  data-state="Default"
                  className="py-0.5 flex justify-start items-center overflow-hidden"
                >
                  <div className={`px-3 py-2 bg-neutral-50 rounded-md flex justify-between items-center w-full`}>
                    <div className="flex justify-start items-center gap-2">
                      <IoHomeOutline className="w-5 h-5 text-[#717680]" />
                      <div className="justify-start text-[#252b37] text-base font-semibold leading-normal">
                        Landing Page
                      </div>
                    </div>
                    <IoChevronForward className="w-4 h-4 text-[#a3a7ae] text-end" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 bg-neutral-50 rounded-md flex justify-between items-center hover:bg-neutral-100 transition-colors"
          >
            <div className="flex justify-start items-center gap-2">
              <IoLogOutOutline className="w-5 h-5 text-[#717680]" />
              <div className="justify-start text-[#252b37] text-base font-semibold leading-normal">
                Logout
              </div>
            </div>
            <IoChevronForward className="w-4 h-4 text-[#a3a7ae] text-end" />
          </button>
        </div>
      </div>
    </>
  );
}
