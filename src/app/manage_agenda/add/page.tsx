"use client"

import { useState } from "react";
import { DatePicker } from "antd";
import { useRipple } from 'use-ripple-hook';
import { HugeiconsIcon } from '@hugeicons/react'
import { OneSquareIcon, TwoSquareIcon } from '@hugeicons/core-free-icons'
import { Button, FormControl, Heading, Text, Textarea, TextInput, Timeline } from '@primer/react';
import { lora, nunito, shantell_sans, suse } from "@/lib/font";
import UploadDropbox from "@/components/manage_agenda/upload-dropbox";
// Import Day.js library and its matching locale
import dayjs from 'dayjs';
import 'dayjs/locale/id';

// Activate the Day.js locale globally
dayjs.locale('id');

export default function Page() {
  const [rippleOnSubmit, eventOnSubmit] = useRipple({ color: "rgba(0, 0, 0, 0.2)" });
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <main className="border-r-0 border-r-red-400 w-full overflow-hidden pl-20">
        <div className="h-fit max-w-md flex flex-col gap-4 pt-8 pb-2 px-4 border-r-0 border-r-gray-400 border-0 font-sans bg-white">
          <div>
            <h2 className={`mb-1 text-xl font-semibold ${lora.className}`}>
              Tambah poster agenda
            </h2>
            <Text size="medium" weight="normal" className="block text-neutral-500">
              Unggah poster agenda untuk ditampilkan di dasbor utama.&#10;
            </Text>
            <Text size="small" weight="normal" className="text-neutral-500">
              <span className="text-red-500">*</span> wajib diisi
            </Text>
          </div>

          {/* === Form Tambah Poster ==== */}
          <Timeline clipSidebar>
            {/* NO. 1 */}
            <Timeline.Item condensed>
              <Timeline.Badge className={`-pt-5! py-5! text-sm font-normal ${lora.className}`}>1</Timeline.Badge>
              <Timeline.Body>
                <FormControl aria-label="project-name-field" className="flex-none">
                  <FormControl.Label
                    required
                    requiredText=""
                  // className="mb-1 w-fit block text-sm font-semibold text-gray-900 cursor-pointer"
                  >
                    Nama agenda <span className="text-red-500">*</span>
                  </FormControl.Label>
                  <TextInput className={`w-full`} />
                  <FormControl.Caption className="">
                    Misal:&nbsp;
                    <span className="font-medium text-purple-500">Yudisium semester ganjil</span>
                  </FormControl.Caption>
                </FormControl>
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
                    Tentukan tanggal <span className="text-red-500">*</span>
                  </FormControl.Label>
                  <DatePicker format={"DD MMMM YYYY"} className={`w-[55%]`} placement="bottomLeft" />
                  <FormControl.Caption className="">
                    Jika acara terdiri dari beberapa hari, cukup masukkan tanggal hari pertama.
                  </FormControl.Caption>
                </FormControl>
              </Timeline.Body>
            </Timeline.Item>

            {/* NO. 3 */}
            <Timeline.Item>
              <Timeline.Badge className={`text-sm font-normal ${lora.className}`}>3</Timeline.Badge>
              <Timeline.Body>
                <FormControl aria-label="project-desc-field" className="flex-none">
                  <FormControl.Label
                  // className="mb-1 w-fit block text-sm font-semibold text-gray-900 cursor-pointer"
                  >
                    Pilih berkas <span className="text-red-500">*</span>
                  </FormControl.Label>
                  <UploadDropbox format="image/*" />
                  <FormControl.Caption className="">
                    Tipe: <span className="">.jpg, .jpeg, .png</span>
                  </FormControl.Caption>
                </FormControl>
              </Timeline.Body>
            </Timeline.Item>

            {/* NO. 4 */}
            <Timeline.Item className="flex items-end">
              <Timeline.Badge className={`text-sm font-normal ${lora.className}`}>4</Timeline.Badge>
              <Timeline.Body>
                <Button variant="primary">Simpan</Button>
              </Timeline.Body>
            </Timeline.Item>
          </Timeline>
        </div>
      </main>
    </>
  )
}