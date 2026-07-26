"use client";

import { useRouter } from "next/navigation";
import { Select } from "antd";
import { Text } from '@primer/react';
import { useRipple } from 'use-ripple-hook';
import { useQuery } from "@tanstack/react-query";
import { Table, DataTable } from '@primer/react/experimental';
import { google_sans, lora, mona_sans, noto_sans, noto_serif, roboto, roboto_flex, shantell_sans, suse } from "@/lib/font";

export default function TableKelas({ onSelectDelete }: { onSelectDelete: (id: any, username: string, element: any) => void }) {
  const router = useRouter();
  const rippleOptions = { color: "rgba(0, 0, 0, 0.2)" };
  const [rippleOnAdd, eventOnAdd] = useRipple(rippleOptions);

  const {
    data: kelasList,
    isLoading: areKelasLoading, // Check if data is being fetched for 1st time (initial loading)
    isFetching: areKelasFetching,
    isSuccess: isKelasSuccess,
    isError: isKelasError,
  } = useQuery({
    queryKey: ["manage-users"],
    /* Below is commented because the default value is already undefined */
    // initialData: undefined,
    refetchOnMount: true,
    queryFn: async () => {
      let data: {
        id: number;
        mata_kuliah: string;
        jam_pelajaran: string;
        ruang: string;
        status?: number;
        updated_at?: string;
      }[] = [
          {
            id: 0,
            mata_kuliah: "Matematika",
            jam_pelajaran: "08.00-10.00",
            ruang: "A101"
          },
          {
            id: 1,
            mata_kuliah: "Fisika",
            jam_pelajaran: "10.00-12.00",
            ruang: "A102",
            status: 1
          },
          {
            id: 2,
            mata_kuliah: "Purbaya",
            jam_pelajaran: "12.00-14.00",
            ruang: "A103"
          },
          {
            id: 3,
            mata_kuliah: "Kalkulus",
            jam_pelajaran: "14.00-16.00",
            ruang: "A104"
          }];

      return data;
    }
  });

  const numberedUsers = (kelasList ?? []).map((item, index) => ({
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
                    <Select
                      labelInValue
                      defaultValue={{ value: status }}
                      style={{ width: "75%" }}
                      onChange={() => {

                      }}
                      options={[
                        {
                          value: 0,
                          label: 'Belum dikonfirmasi',
                        },
                        {
                          value: 1,
                          label: 'Offline',
                        },
                        {
                          value: 2,
                          label: 'Online',
                        },
                        {
                          value: 3,
                          label: 'Reschedule',
                        },
                        {
                          value: 4,
                          label: 'Kosong',
                        },
                        {
                          value: 5,
                          label: 'Batal',
                        },
                      ]}
                    />
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