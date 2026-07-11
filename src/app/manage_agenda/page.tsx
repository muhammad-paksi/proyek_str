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
import { mona_sans, noto_sans, suse } from "@/lib/font";

export default function Page() {
  const pathname = usePathname();
  const navItems = [
    { text: "Manage", href: "/manage_agenda", icon: <ClipboardList size={18} /> },
    { text: "Add", href: "/manage_agenda/add", icon: <ListPlus size={18} /> },
  ];

  const { 
    data: agendaList, 
    isLoading: areAgendaLoading, // Check if data is being fetched for 1st time (initial loading)
    isFetching: areAgendaFetching, 
    isSuccess: isAgendaSuccess,
    isError: isAgendaError,
  } = useQuery({
    queryKey: ["manage-agenda"],
    /* Below is commented because the default value is already undefined */
    // initialData: undefined,
    refetchOnMount: true,
    queryFn: async () => {
      let data:{
        id: string;
        kodeKelas: string;
        kodeRuang: string;
        mk: string;
        dosen: string;
        jamMulai: string;
        jamSelesai: string;
        keterangan: string | null;
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

      <main className="w-screen h-[73vh] pl-6 pr-5 ">
        {agendaList ? (
          <Table.Container>
            <Table.Title as="h2" id="repositories-default">
              Repositories
            </Table.Title>
            <DataTable
              data={agendaList}
              columns={[
                { header: "Kelas", field: "kodeKelas" },
                { header: "Ruang", field: "kodeRuang" },
                { header: "Mata Kuliah", field: "mk" },
                { header: "Dosen", field: "dosen" },
                { header: "Jam Mulai", field: "jamMulai" },
                { header: "Jam Selesai", field: "jamSelesai" },
                { header: "Keterangan", field: "keterangan" },
                {
                  header: "Actions",
                  id: "id",
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
                              <ActionList.Item>Edit row</ActionList.Item>
                              <ActionList.Item>Copy row</ActionList.Item>
                              <ActionList.Item>Export row as CSV</ActionList.Item>
                              <ActionList.Divider />
                              <ActionList.Item variant="danger">Delete row</ActionList.Item>
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