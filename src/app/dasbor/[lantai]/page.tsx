"use client"

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import Tooltip from "@mui/material/Tooltip";
import {Button} from 'antd'
import Header from "@/components/header";

export default function Page() {
  const [ isSidebarOpen, setIsSidebarOpen ] = useState<boolean>(false);
  const [ isBurgerHovered, setIsBurgerHovered ] = useState<boolean>(false);

  return (
    <>
      <Header />

      <main className="w-screen h-[73vh] grid grid-cols-6 pl-6 pr-5 ">
        <div className="col-span-2 border-e border-e-gray-300">

        </div>
        <div className="col-span-4">

        </div>
      </main>

      {/* FOTO-FOTO DOSEN */}
      <section className="w-screen h-[20vh] border-t border-t-gray-300">

      </section>
    </>
  )
}