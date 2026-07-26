"use client";

import { useRouter } from "next/navigation";
import { Select, Tag } from "antd";
import { Text } from '@primer/react';
import { useRipple } from 'use-ripple-hook';
import { useQuery } from "@tanstack/react-query";
import { Table, DataTable } from '@primer/react/experimental';
import { google_sans, lora, mona_sans, noto_sans, noto_serif, roboto, roboto_flex, shantell_sans, suse } from "@/lib/font";
import { getPelaksanaanList } from "@/server/verifikasi";
import dayjs from "dayjs";

export default function TableVerifikasi({ 
  date, 
  kodeKelas, 
  onSelectDelete 
}: { 
  date: Date;
  kodeKelas: string | null;
  onSelectDelete: (id: any, username: string, element: any) => void;
}) {
  const router = useRouter();
  const rippleOptions = { color: "rgba(0, 0, 0, 0.2)" };
  const [rippleOnAdd, eventOnAdd] = useRipple(rippleOptions);

  const dateStr = dayjs(date).format('YYYY-MM-DD');

  const {
    data: pelaksanaanList,
    isLoading: arePelaksanaanLoading,
    isFetching: arePelaksanaanFetching,
    isSuccess: isPelaksanaanSuccess,
    isError: isPelaksanaanError,
  } = useQuery({
    queryKey: ["verifikasi-pelaksanaan", dateStr, kodeKelas],
    refetchOnMount: true,
    queryFn: async () => {
      const res = await getPelaksanaanList({ date: dateStr, kodeKelas });
      return res?.data ?? [];
    }
  });

  const numberedUsers = (pelaksanaanList ?? []).map((item, index) => ({
    ...item,
    no: index + 1,
  }));

  return (
    <>
      {pelaksanaanList ? (
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
                width: "17%",
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
                width: "23%",
                renderCell: (row) => {
                  const status = row.status || 0;
                  console.log("status", status)
                  return (
                    status == 1 ? <Tag color="blue" variant="outlined" className="rounded-full! font-medium">Offline</Tag>
                    : status == 2 ? <Tag color="purple" variant="outlined" className="rounded-full! font-medium">Online</Tag>
                    : status == 3 ? <Tag color="orange" variant="outlined" className="rounded-full! font-medium">Pindah</Tag>
                    : status == 4 ? <Tag color="volcano" variant="outlined" className="rounded-full! font-medium">Kosong</Tag>
                    : status == 5 ? <Tag color="error" variant="outlined" className="rounded-full! font-medium">Dibatalkan</Tag>
                    : <Tag color="gold" variant="outlined" className="rounded-full! font-medium">Belum dikonfirmasi</Tag>
                  )
                }
              },
              // {
              //   header: "Aksi",
              //   id: "id",
              //   width: "15%",
              //   renderCell: (row) => {
              //     return (
              //       <>

              //       </>
              //     )
              //   },
              // },
            ]}
          />
        </Table.Container>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p>Data tidak ditemukan</p>
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