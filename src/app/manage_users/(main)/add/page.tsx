"use client"

import { useState } from "react";
import { Check, X } from "lucide-react";
import { DatePicker, Select, Switch } from "antd";
import { useRipple } from 'use-ripple-hook';
import MenuItem from '@mui/material/MenuItem';
import { HugeiconsIcon } from '@hugeicons/react';
import { OneSquareIcon, TwoSquareIcon } from '@hugeicons/core-free-icons';
import { Button, FormControl, Heading, Text, Textarea, TextInput, Timeline } from '@primer/react';
import { lora, nunito, shantell_sans, suse } from "@/lib/font";

export default function Page() {
  const [rippleOnSubmit, eventOnSubmit] = useRipple({ color: "rgba(0, 0, 0, 0.2)" });
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <main className="border-r-0 border-r-red-400 w-full overflow-hidden pl-20">
        <div className="h-fit max-w-md flex flex-col gap-4 pt-8 pb-2 px-4 border-r-0 border-r-gray-400 border-0 font-sans bg-white">
          <div>
            <h2 className={`mb-1 text-xl font-semibold ${lora.className}`}>
              Tambah pengguna
            </h2>
            <Text size="medium" weight="normal" className="block text-neutral-500">
              Tambahkan pengguna yang akan diberikan akses khusus.&#10;
            </Text>
            <Text size="small" weight="normal" className="text-neutral-500">
              <span className="text-red-500">*</span> wajib diisi
            </Text>
          </div>

          {/* === Form Tambah Poster ==== */}
          <Timeline clipSidebar>
            {/* NO. 1 */}
            <Timeline.Item>
              <Timeline.Badge className={`text-sm font-normal ${lora.className}`}>1</Timeline.Badge>
              <Timeline.Body>
                <FormControl aria-label="project-name-field" className="flex-none">
                  <FormControl.Label
                    required
                    requiredText=""
                  // className="mb-1 w-fit block text-sm font-semibold text-gray-900 cursor-pointer"
                  >
                    Pilih username <span className="text-red-500">*</span>
                  </FormControl.Label>
                  <TextInput className={`w-full`} />
                  <FormControl.Caption className="">
                    Misal:&nbsp;
                    <span className="font-medium text-green-600">tim-bubadibako</span>
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
                    Tentukan tipe pengguna<span className="text-red-500">*</span>
                  </FormControl.Label>
                  <Select
                    placeholder="Pilih role"
                    style={{ width: 120 }}
                    onChange={() => {

                    }}
                    options={[
                      { value: 'mahasiswa', label: 'Mahasiswa' },
                      { value: 'staf', label: 'Staf' },
                      { value: 'admin', label: 'Admin' },
                    ]}
                  />
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
                  <FormControl.Label
                  // className="mb-1 w-fit block text-sm font-semibold text-gray-900 cursor-pointer"
                  >
                    Status pengguna <span className="text-red-500">*</span>
                  </FormControl.Label>
                  <div className="flex items-center gap-5">
                    <span>Apakah aktif? </span>
                    <Switch 
                      className="flex items-center"
                      checkedChildren="Ya"
                      unCheckedChildren="Tidak"
                    />
                  </div>
                  <FormControl.Caption className="">
                    Jika tidak aktif, maka akun tersebut tidak dapat dipakai, hingga statusnya berubah menjadi <code>aktif</code>.
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