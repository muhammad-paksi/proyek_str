"use client"

import { useState } from "react"
import Link from "next/link";
import { Drawer } from "antd"
import Clock from 'react-live-clock';
import { Hamburger, Menu, PanelLeftOpen } from "lucide-react";
import Tooltip from "@mui/material/Tooltip";
import SideBar from "@/components/sidebar";
import { suse } from "@/lib/font";

export default function Header(){

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <>
      <header className="w-screen h-[7vh] flex items-center justify-between py-2 pl-7 pr-16 border-b border-b-gray-300 bg-white">
        {/* LEFT NAV */}
        <div className="h-full w-fit flex items-center">
          <Tooltip 
            title="Open menu" 
            placement="bottom-start" 
            disableInteractive
            className="mr-5"
          >
            <button
              className="p-1 rounded-md bg-white hover:bg-gray-300/75 border-0 border-gray-300 cursor-pointer"
              onClick={() => setIsSidebarOpen?.(true)} // Always set to true because this is a button to open the sidebar
            >
              <Menu size={16} strokeWidth={2.25} />
            </button>
          </Tooltip>
          <Link href={"/dasbor"} className="w-fit h-full">
            <img src="/Jti_polinema.svg" alt="Logo" className="h-[95%] w-auto" />
          </Link>
        </div>

        {/* RIGHT NAV */}
        <div className="w-fit h-full flex items-center">
          <Clock format={'HH:mm:ss'} ticking={true} timezone={'Asia/Jakarta'} className={`text-xl font-medium ${suse.className}`} />
        </div>
      </header>

      <Drawer
        placement="left"
        closable={false}
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        classNames={{
          body: "[&_a]:text-inherit!",
        }}
        styles={{
          wrapper: {
            width: "13rem",
            borderTopRightRadius: "0.75rem",
            borderBottomRightRadius: "0.75rem",
          },
          section: {
            borderTopRightRadius: "0.75rem",
            borderBottomRightRadius: "0.75rem",
          },
          body: {
            padding: "0px",
          },
        }}
      >
        <SideBar withBurger setIsSidebarOpen={setIsSidebarOpen} />
      </Drawer>
    </>
   )
}