"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CalendarFold, LibraryBig, ListTodo, Users, X, LogOut, Building2, Feather, LampWallUp, ScrollText } from "lucide-react";
import Tooltip from "@mui/material/Tooltip";
import { suse } from "@/lib/font";
import BaseUIScrollWrapper from "@/components/wrapper/baseui_scroll_wrapper";
import NavMenuWrapper from "@/components/wrapper/nav_menu_wrapper";
import { signOut } from "@/server/auth/signout";
import { getUserRole } from "@/server/auth/get-role";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// 1. Extend Day.js with required plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// 2. Target a specific timezone and get the year
const year = dayjs().tz("Asia/Jakarta").year(); 
// console.log(year);

/** A component that appears on the side of page. */
export default function SideBar({
  withBurger = false,
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  withBurger?: boolean;
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (open: boolean) => void;
}) {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    getUserRole().then((userRole) => setRole(userRole));
  }, []);

  const isSuperAdmin = role === 'super_admin';
  const isStaf = role === 'staf' || isSuperAdmin;
  const isMahasiswa = role === 'mahasiswa' || isSuperAdmin;
  const isAdminJurusan = role === 'admin' || role === 'admin_jurusan' || isSuperAdmin;

  return (
    <>
      <div className={`flex flex-col w-full h-full ${suse.className}`}>
        <div className="h-[7vh] flex flex-col">
          <div className={`h-full flex items-center justify-between ps-4 pe-3`}>
            <Link
              href="/"
              prefetch={false}
              className="h-[50%] flex justify-start items-center ps-2 pe-4"
            >
              <img src="/Jti_polinema.svg" alt="Logo" className="h-full w-auto" />
            </Link>
            {withBurger && (
              <Tooltip title="Open menu" placement="bottom-start" disableInteractive>
                <button
                  className="p-1 rounded-md hover:bg-gray-300/75 cursor-pointer"
                  onClick={() => setIsSidebarOpen?.(false)}
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </Tooltip>
            )}
          </div>

          {/* mt-auto mendorong elemen hr ini ke dasar kontainer */}
          <hr className="mt-auto ml-2 mr-3 border-gray-300" />
        </div>

        <div className="flex-0 mt-0 pt-2 pb-2 border-0">
          {/* Nav element */}
          <nav
            className="mt-0 md:flex md:flex-col gap-1 px-2 border-0"
            aria-label="Main navigation"
          >
            {/* Dashboard: dapat diakses semua role */}
            <NavMenuWrapper href="/dasbor">
              <Building2 className="w-4" />
              <span className="text-sm font-normal group-hover:underline">
                Dashboard
              </span>
            </NavMenuWrapper>

            {/* Manage Dashboard: Staf & Super Admin */}
            {isStaf && (
              <NavMenuWrapper href="/dasbor/manage/lantai_6">
                <LibraryBig className="w-4" />
                <span className="text-sm font-normal group-hover:underline">
                  Manage dashboard
                </span>
              </NavMenuWrapper>
            )}

            {/* Manage Agenda: Staf & Super Admin */}
            {isStaf && (
              <NavMenuWrapper href="/manage_agenda">
                <CalendarFold className="w-4" />
                <span className="text-sm font-normal group-hover:underline">
                  Manage agenda
                </span>
              </NavMenuWrapper>
            )}

            {/* Kelas Saya: Mahasiswa & Super Admin */}
            {isMahasiswa && (
              <NavMenuWrapper href="/my_class">
                <LibraryBig className="w-4" />
                <span className="text-sm font-normal group-hover:underline">
                  Kelas saya
                </span>
              </NavMenuWrapper>
            )}

            {/* Verifikasi Kelas: Admin Jurusan & Super Admin */}
            {isAdminJurusan && (
              <NavMenuWrapper href="/verifikasi_kelas">
                <ListTodo className="w-4" />
                <span className="text-sm font-normal group-hover:underline">
                  Verifikasi kelas
                </span>
              </NavMenuWrapper>
            )}

            {/* Manage Users: Admin Jurusan & Super Admin */}
            {isAdminJurusan && (
              <NavMenuWrapper href="/manage_users">
                <Users className="w-4" />
                <span className="text-sm font-normal group-hover:underline">
                  Manage users
                </span>
              </NavMenuWrapper>
            )}

            <button
              type="button"
              onClick={async () => {
                await signOut();
                router.replace("/akun/masuk");
              }}
              className="mt-2 w-full flex items-center gap-2.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors text-sm font-medium cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </nav>
        </div>

        {/* Footer element */}
        <footer className="mt-auto shrink-0 pr-1.25 pb-2 border-t-0 border-t-gray-300">
          <hr className="mx-2 mb-3 border-gray-300" />
          {/* <div className="flex justify-start items-center py-1 px-2 text-xl font-semibold">
            Logo
          </div> */}
          {/* <Link href={"/dasbor"} className="ml-5 mb-2 inline-block w-fit h-6">
            <img src="/Jti_polinema.svg" alt="Logo" className="h-full w-auto" />
          </Link> */}
          <Link href={"https://jti.polinema.ac.id/sejarah/"} className="block ml-3.25 mb-1 w-fit px-0.5 drawerlink-gray-500 text-sm font-semibold">
            Tentang kami
          </Link>
          <Link href={"https://jti.polinema.ac.id/tata-tertib/"} className="block ml-3.25 w-fit px-0.5 drawerlink-gray-500 text-sm font-semibold">
            Syarat dan Ketentuan
          </Link>
          <div className="ml-3.25 mt-3 w-fit px-0.5 text-[#C19A6B] text-sm font-semibold">
            © {year} SI Diseminasi
          </div>
        </footer>
      </div>
    </>
  );
}
