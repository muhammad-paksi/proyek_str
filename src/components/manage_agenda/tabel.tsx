"use client";

import Link from "next/link";
import { useRipple } from 'use-ripple-hook';
import { useQuery } from "@tanstack/react-query";
import { Card, Button as ButtonHero } from "@heroui/react";
import { Table, DataTable } from '@primer/react/experimental';
import { CalendarX, ClipboardList, Eraser, ListPlus, Menu, Microscope, Paperclip, PenLine } from "lucide-react";
import { KebabHorizontalIcon } from '@primer/octicons-react';
import { ActionList, ActionMenu, IconButton, Text } from '@primer/react';
import { lora, mona_sans, noto_sans, shantell_sans, suse } from "@/lib/font";

export default function TableAgenda() {
  const rippleOptions = { color: "rgba(0, 0, 0, 0.2)" };
  const [rippleOnAdd, eventOnAdd] = useRipple(rippleOptions);

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
      let data: AgendaRow[] = [{
        id: 1,
        nama: "Agenda 1",
        imageNumber: 1,
        waktu: new Date(),
      }, {
        id: 2,
        nama: "Agenda 2",
        imageNumber: 2,
        waktu: new Date(),
      }, {
        id: 3,
        nama: "Agenda 3",
        imageNumber: 3,
        waktu: new Date(),
      }];

      return data;
    }
  });

  const numberedAgenda = (agendaList ?? []).map((item, index) => ({
    ...item,
    no: index + 1,
  }));

  return (
    <>
      {agendaList ? (
        <Table.Container className="w-5/5">
          <Table.Title as="h2" id="agenda-table">
            <span className={`text-lg ${lora.className}`}>Daftar Agenda</span>
          </Table.Title>
          <DataTable
            data={numberedAgenda}
            columns={[
              {
                header: () => (
                  <Text className={`w-full text-center ${noto_sans.className}`}>
                    No.
                  </Text>
                ),
                id: "no",
                width: "5%",
                rowHeader: false,
                renderCell: (row) => (
                  <Text className={`w-full text-center text-sm font-semibold ${noto_sans.className}`}>
                    {row.no}.
                  </Text>
                ),
              }, {
                header: "Nama",
                field: "nama",
                width: "20%",
                renderCell: (row) => (
                  <Text className={`text-sm font-normal ${noto_sans.className}`}>
                    {row.nama ?? "-"}
                  </Text>
                ),
              }, {
                header: "",
                field: "deskripsi",
                width: "22%",
                renderCell: (row) => {
                  const deskripsi = row.deskripsi;
                  return (
                    deskripsi ? (
                      <Text title={row.deskripsi ?? ""} className={`text-gray-500 text-sm ${noto_sans.className}`}>
                        {row.deskripsi}
                      </Text>
                    ) : (
                      <>
                        <Text className={`italic! text-gray-400 ${noto_sans.className}`}>
                          Tidak ada deskripsi
                        </Text>
                      </>
                    )  
                  );
                },
              }, {
                header: "Waktu",
                field: "waktu",
                renderCell: (row) => {
                  const date = row.waktu instanceof Date ? row.waktu : new Date(row.waktu);
                  return (
                    <Text className={`text-sm ${suse.className}`}>
                      {date.toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </Text>
                  );
                },
              }, {
                header: "",
                id: "images",
                renderCell: (row) => {
                  return row.imageNumber ? (
                    <div className="flex items-center gap-2">
                      <Paperclip size={13} strokeWidth={1} />
                      <Link href={`/manage_agenda/edit/${row.id}`} className={`text-blue-500 text-sm ${mona_sans.className}`}>
                        {row.imageNumber} &nbsp;gambar
                      </Link>
                    </div>
                  ) : (
                    <Text className="text-xs" style={{ color: "fg.muted" }}>
                      Tidak ada gambar
                    </Text>
                  )
                },
              }, {
                header: "Opsi",
                id: "actions",
                width: "15%",
                renderCell: (row) => {
                  return (
                    <ActionMenu>
                      <ActionMenu.Anchor>
                        <IconButton
                          aria-label={`Actions: ${row.nama}`}
                          title={`Actions: ${row.nama}`}
                          size="small"
                          icon={KebabHorizontalIcon}
                          variant="invisible"
                          className="min-w-0 min-h-0 w-auto! h-auto! px-1! py-0.75!"
                        />
                      </ActionMenu.Anchor>
                      <ActionMenu.Overlay>
                        <ActionList>
                          <ActionList.Item><ActionList.LeadingVisual><PenLine  size={12} strokeWidth={2}/></ActionList.LeadingVisual> Edit</ActionList.Item>
                          <ActionList.Item><ActionList.LeadingVisual><Microscope size={12} strokeWidth={2}/></ActionList.LeadingVisual> Lihat</ActionList.Item>
                          <ActionList.Divider />
                          <ActionList.Item variant="danger"><ActionList.LeadingVisual><Eraser size={12} strokeWidth={2}/></ActionList.LeadingVisual> Hapus</ActionList.Item>
                        </ActionList>
                      </ActionMenu.Overlay>
                    </ActionMenu>
                  );
                },
              },
            ]}
          />
        </Table.Container>
      ) : (
        <Card className="max-w-full lg:max-w-lg mx-auto text-center bg-transparent shadow-none">
          <Card.Content className="flex flex-col items-center justify-center py-10 gap-4">
            <div className="py-2 bg-default-100 rounded-full text-default-500">
              <CalendarX size={40} />
            </div>
            <div className="space-y-1">
              <p className={`text-lg font-semibold ${lora.className}`}>Belum Ada Agenda</p>
              <p className={`text-sm text-default-400 ${noto_sans.className}`}>Jadwal agenda yang akan datang akan muncul di sini.</p>
            </div>
            <Link href="/manage_agenda/add">
              <ButtonHero /* color="primary" */ variant="outline" size="sm" className={`mt-2 px-3.5 py-4.5 rounded-lg bg-blue-400 text-white text-sm font-semibold ${mona_sans.className}`} ref={rippleOnAdd} onPointerDown={eventOnAdd}>
                Tambah Agenda
              </ButtonHero>
            </Link>
          </Card.Content>
        </Card>
      )}
    </>
  )
}

/** Raw row type matching the agenda schema */
type AgendaRow = {
  id: number;
  nama: string | null;
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