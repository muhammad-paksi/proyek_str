"use client"

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DatePicker } from "antd";
import { useRipple } from 'use-ripple-hook';
import { useQuery } from "@tanstack/react-query";
import { HugeiconsIcon } from '@hugeicons/react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { OneSquareIcon, TwoSquareIcon } from '@hugeicons/core-free-icons'
import { Button, FormControl, Heading, Text, Textarea, TextInput, Timeline } from '@primer/react';
import { google_sans_flex, lora, mona_sans, noto_sans, nunito, shantell_sans, suse } from "@/lib/font";
import 'react-photo-view/dist/react-photo-view.css';

// Import Day.js library and its matching locale
import dayjs from 'dayjs';
import 'dayjs/locale/id';

// Activate the Day.js locale globally
dayjs.locale('id');

export default function Page() {
  const { id } = useParams();

  const [rippleOnSubmit, eventOnSubmit] = useRipple({ color: "rgba(0, 0, 0, 0.2)" });
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: agendaDetail,
    isLoading: areAgendaLoading, // Check if data is being fetched for 1st time (initial loading)
    isFetching: areAgendaFetching,
    isSuccess: isAgendaSuccess,
    isError: isAgendaError,
  } = useQuery({
    queryKey: ["manage-agenda", id],
    /* Below is commented because the default value is already undefined */
    // initialData: undefined,
    refetchOnMount: true,
    queryFn: async () => {
      let data: AgendaDetailType = {
        id: 1,
        nama: "Seminar proposal",
        waktu: "23 Januari 2026",
        imageList: [
          {
            id: 1,
            url: "/agenda_view_example/the-falcon-9-rocket-failed-to-land-at-sea.jpg",
          },
          {
            id: 2,
            url: "/agenda_view_example/693620562_966708326124323_631974499786665596_n.jpg",
          },
          {
            id: 3,
            url: "/agenda_view_example/starship_carousel3_card1_m.jpg",
          },
          {
            id: 4,
            url: "/agenda_view_example/Science_spacex_1227204520.jpg",
          },
          {
            id: 5,
            url: "/agenda_view_example/crew1-docking.jpg",
          }
        ],
      };

      return data;
    }
  });

  return (
    <>
      <main className="border-r-0 border-r-red-400 w-full overflow-hidden pl-20">
        <div className="h-fit max-w-full flex flex-col gap-4 pt-8 pb-2 px-4 border-r-0 border-r-gray-400 border-0 font-sans bg-white">
          <div>
            <h2 className={`mb-1 text-xl font-semibold ${lora.className}`}>
              Detail agenda
            </h2>
            <Text size="medium" weight="normal" className="block text-neutral-500">
              Berikut adalah informasi mengenai agenda yang ingin Anda lihat.&#10;
            </Text>
            {/* <Text size="small" weight="normal" className="text-neutral-500">
              <span className="text-red-500">*</span> wajib diisi
            </Text> */}
          </div>

          {/* === Form Tambah Poster ==== */}
          <Timeline clipSidebar>
            {/* NO. 1 */}
            <Timeline.Item>
              <Timeline.Badge className={`text-sm font-normal ${lora.className}`}>1</Timeline.Badge>
              <Timeline.Body>
                <Text className={`text-black font-medium`}>Nama Agenda</Text>
                <p className={`text-base font-normal ${mona_sans.className}`}>{agendaDetail?.nama || ""}</p>
              </Timeline.Body>
            </Timeline.Item>

            {/* NO. 2 */}
            <Timeline.Item>
              <Timeline.Badge className={`text-sm font-normal ${lora.className}`}>2</Timeline.Badge>
              <Timeline.Body className="border-0">
                <FormControl aria-label="project-name-field" className="flex-none border-0 border-red-500">
                  <FormControl.Label
                    required
                    requiredText=""
                  // className="mb-1 w-fit block text-sm font-semibold text-gray-900 cursor-pointer"
                  >
                    <Text className={`text-black font-medium`}>Deskripsi</Text>
                  </FormControl.Label>
                  {agendaDetail?.deskripsi ? (
                    <p className={`font-normal ${lora.className}`}>
                      {agendaDetail.deskripsi}
                    </p>
                  ) : (
                    <Text aria-label="Item ini tidak memiliki deskripsi" className={`italic! text-gray-400 ${noto_sans.className}`}>
                      Tidak ada deskripsi
                    </Text>
                  )}
                  <FormControl.Caption className="">

                  </FormControl.Caption>
                </FormControl>
              </Timeline.Body>
            </Timeline.Item>

            {/* NO. 3 */}
            <Timeline.Item>
              <Timeline.Badge className={`text-sm font-normal ${lora.className}`}>3</Timeline.Badge>
              <Timeline.Body>
                <FormControl aria-label="project-desc-field" className="flex-none">
                  <FormControl.Label className="mb-1">
                    <Text className={`text-black font-medium`}>Poster agenda</Text>
                  </FormControl.Label>
                  <PhotoProvider>
                    <div className="border-0 flex gap-1.5">
                      {agendaDetail?.imageList.map((item, index) => (
                        <PhotoView key={index} src={item.url}>
                          <img
                            src={item.url}
                            title={`Gambar ${index + 1}`}
                            alt=""
                            className="h-24 w-full cursor-pointer rounded-lg object-cover border border-gray-200 transition-all duration-200 hover:scale-105 hover:shadow-md"
                          />
                        </PhotoView>
                      ))}
                    </div>
                  </PhotoProvider>
                  <FormControl.Caption className="mt-3!">
                    <b>Total</b>: <span className="">{agendaDetail?.imageList.length || 0} gambar</span>
                  </FormControl.Caption>
                </FormControl>
              </Timeline.Body>
            </Timeline.Item>
          </Timeline>

          <Link
            href={`/manage_agenda/edit/${agendaDetail?.id}`}
            className="mt-2 max-w-xs group flex items-center gap-3 rounded-lg border border-blue-100 bg-linear-to-r from-blue-50 to-white px-4 py-3 no-underline transition-all duration-200 hover:border-blue-300 hover:shadow-md hover:from-blue-100 hover:to-blue-50"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm transition-transform duration-200 group-hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
            </span>
            <span className="flex flex-col">
              <span className={`text-sm font-semibold text-blue-700 group-hover:text-blue-800 ${google_sans_flex.className}`}>
                Edit agenda ini
              </span>
              <span className={`text-xs text-gray-400 group-hover:text-gray-500 ${noto_sans.className}`}>
                Ubah informasi atau poster agenda
              </span>
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto text-blue-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-blue-500"><path d="m9 18 6-6-6-6" /></svg>
          </Link>
        </div>
      </main>
    </>
  )
}

type AgendaDetailType = {
  id: number;
  nama: string;
  waktu: string;
  imageList: Array<{ id: number; url: string }>;
  deskripsi?: string;
}