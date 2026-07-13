"use client"

import { useState } from "react";
import { DatePicker } from "antd";
import { useRipple } from 'use-ripple-hook';
import { lora, nunito, suse } from "@/lib/font";
import { FormControl, Heading, Text, Textarea, TextInput } from '@primer/react';
import UploadDropbox from "@/components/manage_agenda/upload-dropbox";

export default function Page() {
  const [rippleOnSubmit, eventOnSubmit] = useRipple({ color: "rgba(0, 0, 0, 0.2)" });
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <main className="border-r-0 border-r-red-400 w-full overflow-hidden pl-20">
        <div className="h-fit max-w-md flex flex-col gap-4 pt-8 pb-2 px-4 border-r-0 border-r-gray-400 border-0 font-sans bg-white">
          <div>
            <h2 className={`text-xl font-semibold ${lora.className}`}>
              Tambah poster agenda
            </h2>
            <Text size="medium" weight="normal" className="italic text-neutral-500">
              Unggah poster agenda untuk ditampilkan di dasbor utama.\n
            </Text>
            <Text size="medium" weight="normal" className="text-neutral-500">
              <span className="text-red-500">*</span> wajib diisi
            </Text>
          </div>

          {/* === Form Tambah Poster ==== */}
          <FormControl aria-label="project-name-field" className="flex-none">
            <FormControl.Label
              required
              requiredText=""
              // className="mb-1 w-fit block text-sm font-semibold text-gray-900 cursor-pointer"
            >
              Tanggal agenda <span className="text-red-500">*</span>
            </FormControl.Label>
            <DatePicker format={"DD-MM-YYYY"} />
            <FormControl.Caption className="">
              Misal:&nbsp;
              <span className="font-medium text-blue-500">20-07-2026</span>
            </FormControl.Caption>
          </FormControl>

          <FormControl aria-label="project-desc-field" className="flex-none">
            <FormControl.Label
              // className="mb-1 w-fit block text-sm font-semibold text-gray-900 cursor-pointer"
            >
              Description <span className="text-red-500">*</span>
            </FormControl.Label>
            <UploadDropbox format="image/*" />
            <FormControl.Caption className="">
              Tipe: <span className="">.jpg, .jpeg, .png</span>
            </FormControl.Caption>
          </FormControl>
        </div>
      </main>
    </>
  )
}