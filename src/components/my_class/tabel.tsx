"use client";

import { useRouter } from "next/navigation";
import { Select, Tag } from "antd";
import { useRipple } from 'use-ripple-hook';
import { useQuery } from "@tanstack/react-query";
import { KebabHorizontalIcon } from '@primer/octicons-react';
import { Table, DataTable } from '@primer/react/experimental';
import {  ActionList, ActionMenu, IconButton, Label, Text } from '@primer/react';
import { CalendarX, ClipboardList, Eraser, ListPlus, Menu, Eye, Paperclip, PenLine, Dot } from "lucide-react";
import { google_sans, lora, mona_sans, noto_sans, noto_serif, roboto, roboto_flex, shantell_sans, suse } from "@/lib/font";
import { getMyClassPelaksanaan } from "@/server/actions/my-class";

export default function TableKelas({
  selectedDate,
}: {
  selectedDate?: string;
}) {
  const router = useRouter();
  const rippleOptions = { color: "rgba(0, 0, 0, 0.2)" };
  const [rippleOnAdd, eventOnAdd] = useRipple(rippleOptions);

  const {
    data: kelasList,
    isLoading: areKelasLoading,
    isFetching: areKelasFetching,
    isSuccess: isKelasSuccess,
    isError: isKelasError,
  } = useQuery({
    queryKey: ["my-class-pelaksanaan", selectedDate],
    refetchOnMount: true,
    queryFn: async () => {
      return await getMyClassPelaksanaan(selectedDate);
    },
  });

  const numberedUsers = [...(kelasList ?? [])]
    .sort((a, b) => a.jam_pelajaran.localeCompare(b.jam_pelajaran))
    .map((item, index) => ({
      ...item,
      no: index + 1,
    }));

  return (
    <>
      {kelasList ? (
        <Table.Container className="w-[70vw]">
          <Table.Title as="h2" id="user-management">
            <span className={`text-base font-semibold ${lora.className!}`}>
              Jadwal perkuliahan
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
                header: "Mata kuliah",
                field: "mata_kuliah",
                align: "start",
                width: "25%",
                renderCell: (row) => {
                  return (
                    <>
                      <span className={`text-sm`}>{row.mata_kuliah}</span>
                    </>
                  )
                }
              },
              {
                header: "Waktu",
                field: "jam_pelajaran",
                align: "start",
                width: "25%",
                renderCell: (row) => {
                  const jam_pelajaran = row.jam_pelajaran.toLowerCase();
                  return (
                    <>
                      <span className={`text-sm`}>{jam_pelajaran}</span>
                    </>
                  )
                }
              },
              {
                header: "Ruang",
                field: "ruang",
                align: "start",
                width: "15%",
                renderCell: (row) => {
                  return (
                    <span className={`text-sm`}>{row.ruang}</span>
                  )
                }
              },
              {
                header: "Status",
                field: "status",
                align: "start",
                width: "20%",
                renderCell: (row) => {
                  const status = row.status || 0;
                  console.log("status", status)
                  return (
                    status == 0 ? <Tag color="#707070" variant="outlined" className="rounded-full! font-medium">Belum dikonfirmasi</Tag>
                    : status == 1 ? <Tag color="#00A550" variant="outlined" className="rounded-full! font-medium">Offline</Tag>
                    : status == 2 ? <Tag color="#4D4DFF" variant="outlined" className="rounded-full! font-medium">Online</Tag>
                    : status == 3 ? <Tag color="#bd752b" variant="outlined" className="rounded-full! font-medium">Reschedule</Tag>
                    : status == 4 ? <Tag color="#ff4f00" variant="outlined" className="rounded-full! font-medium">Kosong</Tag>
                    : <Tag color="#ff4f00" variant="outlined" className="rounded-full! font-medium">Batal</Tag>
                  )
                }
              },
              {
                header: "Aksi",
                id: "id",
                width: "5%",
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
                            <ActionList.Item className="" onClick={() => {
                              router.push(`/my_class/${row.id}/edit`);
                            }}>
                              <span className={`font-medium! ${mona_sans.className}`}>Edit</span>
                              <ActionList.TrailingVisual className="ml-5"><PenLine size={12} strokeWidth={2} /></ActionList.TrailingVisual>
                            </ActionList.Item>
                          </ActionList>
                        </ActionMenu.Overlay>
                      </ActionMenu>
                    </>
                  )
                }
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