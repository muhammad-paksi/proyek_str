"use client"

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Carousel } from 'antd'
import Tooltip from "@mui/material/Tooltip";
import { useRipple } from 'use-ripple-hook';
import { useQuery } from "@tanstack/react-query";
import { Card, Button as ButtonHero } from "@heroui/react";
import { Table, DataTable } from '@primer/react/experimental';
import { CalendarX, ClipboardList, ListPlus, Menu } from "lucide-react";
import { KebabHorizontalIcon } from '@primer/octicons-react';
import { ActionList, ActionMenu, IconButton, Text } from '@primer/react';
import { lora, mona_sans, noto_sans, suse } from "@/lib/font";
import UnderlineNavigation from "@/components/manage_agenda/underline-nav";

export default function Page() {
  const pathname = usePathname();
  const navItems = [
    { text: "Manage", href: "/manage_agenda", icon: <ClipboardList size={18} /> },
    { text: "Add", href: "/manage_agenda/add", icon: <ListPlus size={18} /> },
  ];
  const rippleOptions = {color: "rgba(0, 0, 0, 0.2)"};
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
      let data: AgendaRow[] = [];

      return data;
    }
  });

  /**
   * Group raw agenda rows by (nama + waktu).
   * Rows sharing the same nama & date are merged into one table row,
   * with their images collected for the carousel.
   */
  const groupedAgenda = useMemo<GroupedAgenda[]>(() => {
    if (!agendaList) return [];

    const map = new Map<string, GroupedAgenda>();

    for (const row of agendaList) {
      const dateStr = row.waktu instanceof Date
        ? row.waktu.toISOString().split("T")[0]
        : String(row.waktu);
      const key = `${row.nama ?? ""}|${dateStr}`;

      if (!map.has(key)) {
        map.set(key, {
          id: key,
          nama: row.nama,
          deskripsi: row.deskripsi,
          waktu: row.waktu,
          images: [],
          ids: [],
        });
      }

      const group = map.get(key)!;
      group.ids.push(row.idAgenda);

      if (row.imageURL) {
        group.images.push({ idAgenda: row.idAgenda, imageURL: row.imageURL });
      }

      // Keep the latest deskripsi if current one is null
      if (!group.deskripsi && row.deskripsi) {
        group.deskripsi = row.deskripsi;
      }
    }

    return Array.from(map.values());
  }, [agendaList]);

  return (
    <>
      <main className="w-screen h-[73vh] pl-6 pr-5 ">
        {groupedAgenda.length > 0 ? (
          <Table.Container>
            <Table.Title as="h2" id="agenda-table">
              Daftar Agenda
            </Table.Title>
            <DataTable
              data={groupedAgenda}
              columns={[
                {
                  header: "Nama",
                  field: "nama",
                  renderCell: (row) => (
                    <Text className={`text-sm font-medium ${noto_sans.className}`}>
                      {row.nama ?? "-"}
                    </Text>
                  ),
                },
                {
                  header: "Waktu",
                  field: "waktu",
                  renderCell: (row) => {
                    const date = row.waktu instanceof Date ? row.waktu : new Date(row.waktu);
                    return (
                      <Text className={`text-sm ${noto_sans.className}`}>
                        {date.toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </Text>
                    );
                  },
                },
                {
                  header: "Deskripsi",
                  field: "deskripsi",
                  renderCell: (row) => (
                    <Tooltip title={row.deskripsi ?? "-"} arrow>
                      <Text
                        className={`text-sm ${noto_sans.className}`}
                        style={{
                          display: "block",
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.deskripsi ?? "-"}
                      </Text>
                    </Tooltip>
                  ),
                },
                {
                  header: "Gambar",
                  id: "images",
                  renderCell: (row) => {
                    if (row.images.length === 0) {
                      return (
                        <Text className="text-xs" style={{ color: "fg.muted" }}>
                          Tidak ada gambar
                        </Text>
                      );
                    }

                    if (row.images.length === 1) {
                      return (
                        <Image
                          src={row.images[0].imageURL}
                          alt={row.nama ?? "Agenda"}
                          width={120}
                          height={80}
                          style={{ objectFit: "cover", borderRadius: 4 }}
                        />
                      );
                    }

                    return (
                      <div style={{ width: 120, height: 80 }}>
                        <Carousel
                          autoplay
                          dots
                          style={{ width: 120, height: 80 }}
                        >
                          {row.images.map((img) => (
                            <div key={img.idAgenda}>
                              <Image
                                src={img.imageURL}
                                alt={row.nama ?? "Agenda"}
                                width={120}
                                height={80}
                                style={{ objectFit: "cover", borderRadius: 4 }}
                              />
                            </div>
                          ))}
                        </Carousel>
                      </div>
                    );
                  },
                },
                {
                  header: "Actions",
                  id: "actions",
                  renderCell: (row) => {
                    return (
                      <ActionMenu>
                        <ActionMenu.Anchor>
                          <IconButton
                            aria-label={`Actions: ${row.nama}`}
                            title={`Actions: ${row.nama}`}
                            icon={KebabHorizontalIcon}
                            variant="invisible"
                          />
                        </ActionMenu.Anchor>
                        <ActionMenu.Overlay>
                          <ActionList>
                            <ActionList.Item>Edit</ActionList.Item>
                            <ActionList.Item>Copy</ActionList.Item>
                            <ActionList.Divider />
                            <ActionList.Item variant="danger">Delete</ActionList.Item>
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
      </main>
    </>
  )
}

/** Raw row type matching the agenda schema */
type AgendaRow = {
  idAgenda: number;
  nama: string | null;
  imageURL: string | null;
  deskripsi: string | null;
  waktu: Date;
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