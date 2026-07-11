"use client"

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from 'antd'
import Tooltip from "@mui/material/Tooltip";
import { ActionList, ActionMenu, IconButton, Text, UnderlineNav } from '@primer/react';
import {Table, DataTable} from '@primer/react/experimental';
import {KebabHorizontalIcon, PencilIcon, TrashIcon} from '@primer/octicons-react';
import { ClipboardList, ListPlus, Menu } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/manage_agenda/header";
import { lora, mona_sans, noto_sans, suse } from "@/lib/font";

export default function Page() {
  const pathname = usePathname();
  const navItems = [
    { text: "Kelola", href: "/manage_users", icon: <ClipboardList size={18} /> },
    { text: "Tambah", href: "/manage_users/add", icon: <ListPlus size={18} /> },
  ];

  const { 
    data: userList, 
    isLoading: areAgendaLoading, // Check if data is being fetched for 1st time (initial loading)
    isFetching: areAgendaFetching, 
    isSuccess: isAgendaSuccess,
    isError: isAgendaError,
  } = useQuery({
    queryKey: ["manage-users"],
    /* Below is commented because the default value is already undefined */
    // initialData: undefined,
    refetchOnMount: true,
    queryFn: async () => {
      let data:{
        id: string;
        username: string;
        role: string;
        status: string;
      }[] = []; 
      
      return data;
    }
  });

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

      <main className="w-screen h-[73vh] pl-6 pr-5 pt-5">
        {userList ? (
          <Table.Container className="w-[60vw]">
            <Table.Title as="h2" id="user-management">
              <span className={`text-lg font-semibold ${lora.className!}`}>
                Kelola pengguna
              </span>
            </Table.Title>
            <DataTable
              data={userList}
              columns={[
                { header: "Username", field: "username", align: "start", width: "30%" },
                { header: "Role", field: "role", align: "start" },
                { header: "Status", field: "status", align: "start" },
                {
                  header: "Aksi",
                  id: "id",
                  width: "20%",
                  renderCell: row => {
                    return (
                      <>
                        <ActionMenu>
                          <ActionMenu.Anchor>
                            <IconButton
                              aria-label={`Actions: ${row.id}`}
                              title={`Actions: ${row.id}`}
                              icon={KebabHorizontalIcon}
                              variant="invisible"
                            />
                          </ActionMenu.Anchor>
                          <ActionMenu.Overlay>
                            <ActionList>
                              <ActionList.Item>Edit pengguna</ActionList.Item>
                              <ActionList.Divider></ActionList.Divider>
                              <ActionList.Item>Bekukan pengguna</ActionList.Item>
                              <ActionList.Item variant="danger">Hapus pengguna</ActionList.Item>
                            </ActionList>
                          </ActionMenu.Overlay>
                        </ActionMenu>
                      </>
                    )
                  },
                },
              ]}
            />
          </Table.Container>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>No agenda found</p>
          </div>
        )}
      </main>
    </>
  )
}