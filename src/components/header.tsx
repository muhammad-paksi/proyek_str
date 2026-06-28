"use client"

import { useState } from "react"
import Link from "next/link";
import { Drawer } from "antd"
import { Hamburger } from "lucide-react";
import Tooltip from "@mui/material/Tooltip";
import SideBar from "@/components/sidebar";

export default function Header(){

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <>
      <header className="w-screen h-[7vh] flex items-center justify-between py-2 pl-12 pr-5 border-b border-b-gray-300 bg-white">
        {/* Logo */}
        <Link href={"/dasbor"} className="w-fit h-[80%]">
          <img src="/Jti_polinema.svg" alt="Logo" className="h-full w-auto" />
        </Link>

        <div className="">
          <Tooltip title="Open menu" placement="bottom-start" disableInteractive>
            <button
              className="p-1.5 rounded-md bg-white hover:bg-gray-200/75 border border-gray-300 cursor-pointer"
              onClick={() => setIsSidebarOpen?.(true)} // Always set to true because this is a button to open the sidebar
            >
              <Hamburger size={14} strokeWidth={1.5} />
            </button>
          </Tooltip>
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