"use client"

import { usePathname } from "next/navigation";
import { ClipboardList, ListPlus, Menu } from "lucide-react";
import UnderlineNavigation from "@/components/manage_agenda/underline-nav";

export default function Page(){
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
      <UnderlineNavigation />

      <main>
        
      </main>
    </>
  )
}