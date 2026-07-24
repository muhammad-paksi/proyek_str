"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRipple } from 'use-ripple-hook';
import { useQuery } from "@tanstack/react-query";
import { Card, Button as ButtonHero } from "@heroui/react";
import { KebabHorizontalIcon } from '@primer/octicons-react';
import { Table, DataTable } from '@primer/react/experimental';
import { ActionList, ActionMenu, IconButton, Label, Text } from '@primer/react';
import { CalendarX, ClipboardList, Eraser, ListPlus, Menu, Eye, Paperclip, PenLine, Dot } from "lucide-react";
import { google_sans, lora, mona_sans, noto_sans, noto_serif, roboto, roboto_flex, shantell_sans, suse } from "@/lib/font";
import { Tag } from "antd";

export default function TableUser({ onSelectDelete }: { onSelectDelete: (id: any, username: string, element: any) => void }) {
  const router = useRouter();
  const rippleOptions = { color: "rgba(0, 0, 0, 0.2)" };
  const [rippleOnAdd, eventOnAdd] = useRipple(rippleOptions);

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
      let data: {
        id: number;
        username: string;
        role: string;
        status: string;
      }[] = [
          {
            id: 0,
            username: "Joko",
            role: "mahasiswa",
            status: "active"
          },
          {
            id: 1,
            username: "Widodo",
            role: "staf",
            status: "active"
          },
          {
            id: 2,
            username: "Purbaya",
            role: "admin",
            status: "active"
          },
          {
            id: 3,
            username: "Kalla",
            role: "admin",
            status: "inactive"
          }];

      return data;
    }
  });

  const numberedUsers = (userList ?? []).map((item, index) => ({
    ...item,
    no: index + 1,
  }));

  return (
    <>
      {userList ? (
        <Table.Container className="w-[60vw]">
          <Table.Title as="h2" id="user-management">
            <span className={`text-lg font-semibold ${lora.className!}`}>
              Kelola pengguna
            </span>
          </Table.Title>
          <DataTable
            data={numberedUsers}
            columns={[
              {
                header: () => (
                  <Text className={`w-full text-center ${noto_sans.className}`}>
                    No.
                  </Text>
                ),
                id: "no",
                width: "10%",
                rowHeader: false,
                renderCell: (row) => (
                  <Text className={`w-full text-center text-sm font-semibold ${noto_sans.className}`}>
                    {row.no}.
                  </Text>
                ),
              },
              { 
                header: "Username", 
                field: "username", 
                align: "start", 
                width: "25%",
                renderCell: (row) => {
                  return (
                    <>
                      <span className={`text-sm`}>{row.username}</span>
                    </>
                  )
                } 
              },
              { 
                header: "Role", 
                field: "role", 
                align: "start", 
                width: "25%",
                renderCell: (row) => {
                  const role = row.role.toLowerCase();
                  return (
                    <>
                      {/* <Label 
                        className={`
                          flex! items-center!
                          pl-0.5! pr-2!
                          border-3
                          ${
                            role === "staf" ? "border-[#1338be]!" 
                            : role === "admin" ? "border-[#f2b949]!" 
                            : undefined
                          }
                          ${suse.className}
                        `}
                      > */}
                      <div className={`flex! items-center! text-sm ${suse.className}`}>
                        {/* <Dot size={14} strokeWidth={5} 
                          color={`${
                            role === "staf" ? "#1338be" 
                            : role === "admin" ? "#f2b949" 
                            : "black"
                          }`}
                        /> */}
                        <span className={` font-light!
                          ${
                            role === "staf" ? "text-[#1338be]" 
                            : role === "admin" ? "text-[#f2b949]" 
                            : "black"
                          }
                        `}>●&#160;</span>
                        {role}
                      </div>
                      {/* </Label> */}
                      {/* <span className={`text-sm ${google_sans.className}`}>{row.role.charAt(0).toUpperCase() + row.role.slice(1, row.role.length)}</span> */}
                    </>
                  )
                } 
              },
              { 
                header: "Status", 
                field: "status", 
                align: "start", 
                width: "25%",
                renderCell: (row) => {
                  return row.status.toLowerCase() == "active" 
                    // ? <Label variant="success" size="small" className={`px-1.5! py-0.5! text-xs! font-normal! ${noto_serif.className}`}>active</Label>
                    // : <Label variant="attention" size="large" className={`px-1.5! py-0.5! text-xs! font-normal ${noto_serif.className}`}>inactive</Label>
                    ? <Tag color="#41ab5d" variant="outlined" className="rounded-full! font-medium">active</Tag>
                    : <Tag color="#ff5f1f" variant="outlined" className="rounded-full! font-medium">inactive</Tag>
                }
              },
              {
                header: "Aksi",
                id: "id",
                width: "15%",
                renderCell: (row) => {
                  return (
                    <>
                      <ActionMenu>
                        <ActionMenu.Anchor>
                          <IconButton
                            aria-label={`Lihat, edit, atau hapus agenda`}
                            // title={`Lihat, edit, atau hapus agenda`}
                            size="small"
                            icon={KebabHorizontalIcon}
                            variant="invisible"
                            className="min-w-0 min-h-0 w-auto! h-auto! px-1! py-0.75!"
                          />
                        </ActionMenu.Anchor>
                        <ActionMenu.Overlay className="min-w-fit!">
                          <ActionList>
                            <ActionList.Item className=""
                              onClick={() => {
                                router.push(`/manage_agenda/${row.id}/view`);
                              }}
                            >
                              <span className={`font-medium! ${mona_sans.className}`}>Lihat</span>
                              <ActionList.TrailingVisual className="ml-5"><Eye size={15} strokeWidth={2} /></ActionList.TrailingVisual>
                            </ActionList.Item>
                            
                            <ActionList.Item className="" onClick={() => {
                              router.push(`/manage_agenda/${row.id}/edit`);
                            }}>
                              <span className={`font-medium! ${mona_sans.className}`}>Edit</span>
                              <ActionList.TrailingVisual className="ml-5"><PenLine size={12} strokeWidth={2} /></ActionList.TrailingVisual>
                            </ActionList.Item>

                            <ActionList.Divider />
                            
                            <ActionList.Item
                              className=""
                              variant="danger"
                              onClick={(e) => {
                                // e.currentTarget/target mengambil elemen tombol pemicu yang sedang aktif
                                onSelectDelete(row.id, row.username, e.currentTarget as HTMLElement);
                              }}
                            >
                              <span className={`font-medium! ${mona_sans.className}`}>Hapus</span>
                              <ActionList.TrailingVisual className="ml-5">
                                <Eraser size={14} strokeWidth={2} />
                              </ActionList.TrailingVisual>
                            </ActionList.Item>
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
    </>
  )
}

/** Raw row type matching the agenda schema */
type AgendaRow = {
  id: number;
  nama: string;
  deskripsi?: string | null;
  waktu: Date;
  imageNumber: number | null;
};

/** Grouped agenda: rows with same nama+waktu merged, images collected */
type GroupedAgenda = {
  /** Composite key for DataTable: "nama|waktu" */
  id: string;
  nama: string | null;
  deskripsi: string | null;
  waktu: Date;
  images: { idAgenda: number; imageURL: string }[];
  /** All idAgenda values in this group */
  ids: number[];
};