"use client"

import { usePathname } from "next/navigation";
import { ActionList, ActionMenu, IconButton, Text, UnderlineNav } from '@primer/react';
import { ClipboardList, ListPlus, Menu } from "lucide-react";
import { mona_sans, noto_sans, suse } from "@/lib/font";

export default function UnderlineNavigation(){
  const pathname = usePathname();
  const navItems = [
    {
      text: "Manage",
      href: "/manage_agenda",
      icon: <ClipboardList size={18} />,
    },
    { text: "Add", href: "/manage_agenda/add", icon: <ListPlus size={18} /> },
  ];

  return (
    <>
      <UnderlineNav aria-label="Agenda" className="">
        {navItems.map((item) => {
          // Cek apakah pathname saat ini cocok dengan href tab
          const isCurrent = pathname === item.href;
          return (
            <UnderlineNav.Item
              key={item.href}
              href={item.href}
              leadingVisual={item.icon || ""}
              // Jika cocok, berikan nilai "page", jika tidak, berikan undefined
              aria-current={isCurrent ? "page" : undefined}
              className={`font-medium ${mona_sans.className}`}
            >
              <Text className="text-sm">{item.text}</Text>
            </UnderlineNav.Item>
          );
        })}
      </UnderlineNav>
    </>
  )
}