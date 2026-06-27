"use client"

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Hamburger } from "lucide-react";
import Tooltip from "@mui/material/Tooltip";
import {Button} from '@primer/react'

export default function Page() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <>
      <header className="h-[7vh] flex items-center justify-between py-2 pl-16 pr-5 border-b border-b-gray-300 bg-white">
        {/* Logo */}
        <Link href={"/dasbor"} className="w-fit h-[80%]">
          <img src="/Jti_polinema.svg" alt="Logo" className="h-full w-auto" />
        </Link>

        <div className="">
          <div>
            <Tooltip title="Open menu" placement="bottom-start" disableInteractive>
              <button
                className="ms-0 me-3 p-1.5 rounded-md bg-white hover:bg-gray-200/75 border border-gray-300 cursor-pointer"
                onClick={() => setIsSidebarOpen?.(true)} // Always set to true because this is a button to open the sidebar
              >
                <Hamburger size={14} strokeWidth={1.5} />
              </button>
            </Tooltip>
          </div>
        </div>
      </header>

      <main className="h-[73vh] pl-6 pr-5 ">

      </main>

      {/* FOTO-FOTO DOSEN */}
      <section className="h-[20vh] border-t border-t-gray-300">

      </section>
    </>
  )
}