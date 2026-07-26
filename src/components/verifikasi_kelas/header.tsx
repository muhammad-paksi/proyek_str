"use client"

import { useState } from "react"
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import Tooltip from "@mui/material/Tooltip";
import { Drawer, Dropdown, Space } from "antd"
import { ChevronDown, Hamburger, Menu, PanelLeftOpen } from "lucide-react";
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { suse } from "@/lib/font";
import SideBar from "@/components/sidebar";

/**
 * Load komponen Clock secara dinamis dan matikan SSR.
 * Dilakukan untuk memuat komponen <Clock> secara dinamis (dynamic import) dan menonaktifkan SSR khusus untuk komponen tersebut,
 * agar tidak muncul error Hydration Mismatch.
 */
const Clock = dynamic(() => import('react-live-clock'), { ssr: false });

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  /* Example relative url: "/dasbor/lantai_6" */
  const floor = pathname.split("/")[2];
  const paths = pathname.split("/");
  // console.log(paths)

  return (
    <>
      <header className={`
        w-full h-[7vh] 
        flex items-center justify-between 
        py-2 pl-7 pr-12 
        bg-white 
        border-b border-b-gray-300
      `}>
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
          <div className="w-fit h-full flex items-center">
            <Clock 
              format={"dddd, Do MMMM yyyy"} 
              timezone={'Asia/Jakarta'} 
              locale="id-ID" 
              ticking={true} 
              className={`me-5 text-sm font-normal ${suse.className}`} 
            />
            <Clock 
              format={"kk.mm"} 
              timezone={'Asia/Jakarta'} 
              locale="id-ID" 
              ticking={true} 
              className={`text-lg font-medium ${suse.className}`} 
            />
          </div>
        </div>
      </header>

      <Drawer
        placement="left"
        closable={false}
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        classNames={{
          body: "[&_a.drawerlink-gray-500]:text-gray-500! [&_a.drawerlink-black]:text-black!",
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