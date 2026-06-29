"use client"

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from 'antd'
import { ClipboardList, ListPlus, Menu } from "lucide-react";
import { UnderlineNav } from '@primer/react'
import Tooltip from "@mui/material/Tooltip";
import Header from "@/components/manage_agenda/header";
import { noto_sans, suse } from "@/lib/font";

export default function Page() {
  const pathname = usePathname();
  const navItems = [
    { text: "Manage", href: "/manage_agenda", icon: <ClipboardList size={14} /> },
    { text: "Add", href: "/manage_agenda/add", icon: <ListPlus size={14} /> },
  ];

  return (
    <>
      <Header />
      <UnderlineNav aria-label="Agenda" className="">
        {navItems.map((item) => {
          // Cek apakah pathname saat ini cocok dengan href tab
          const isCurrent = pathname === item.href;
          return (
            <UnderlineNav.Item
              key={item.href}
              href={item.href}
              icon={item.icon || ""}
              // Jika cocok, berikan nilai "page", jika tidak, berikan undefined
              aria-current={isCurrent ? "page" : undefined}
              className={``}
            >
              {item.text}
            </UnderlineNav.Item>
          );
        })}
      </UnderlineNav>

      <main className="w-screen h-[73vh] pl-6 pr-5 ">

      </main>
    </>
  )
}