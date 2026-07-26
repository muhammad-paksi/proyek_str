"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { DatePicker } from "antd";
import { useRipple } from 'use-ripple-hook';
import { Button, FormControl, Text, TextInput, Timeline } from '@primer/react';
import { lora } from "@/lib/font";
import UploadDropbox from "@/components/manage_agenda/upload-dropbox";
import { createAgenda, uploadAgendaFiles } from "@/server/agenda";
import dayjs, { type Dayjs } from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

export default function Page() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [rippleOnSubmit, eventOnSubmit] = useRipple({ color: "rgba(0, 0, 0, 0.2)" });
  const [isLoading, setIsLoading] = useState(false);

  const [nameInput, setNameInput] = useState('');
  const [dateInput, setDateInput] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = async () => {
    if (!nameInput.trim() || !dateInput) return;
    setIsLoading(true);
    try {
      const result = await createAgenda({
        nama: nameInput.trim(),
        waktu: dateInput,
      });

      if (result?.data?.id && files.length > 0) {
        const formData = new FormData();
        formData.set("agendaId", String(result.data.id));
        for (const file of files) {
          formData.append("files", file);
        }
        await uploadAgendaFiles(formData);
      }

      await queryClient.invalidateQueries({ queryKey: ["manage-agenda"] });
      router.push("/manage_agenda");
    } catch (e) {
      console.error("Failed to create agenda:", e);
    } finally {
      setIsLoading(false);
    }
  };

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
            <Timeline.Item>
              <Timeline.Badge className={`text-sm font-normal ${lora.className}`}>1</Timeline.Badge>
              <Timeline.Body>
                <FormControl aria-label="project-name-field" className="flex-none">
                  <FormControl.Label
                    required
                    requiredText=""
                  >
                    Nama agenda <span className="text-red-500">*</span>
                  </FormControl.Label>
                  <TextInput
                    className={`w-full`}
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                  />
                  <FormControl.Caption className="">
                    Misal:&nbsp;
                    <span className="font-medium text-green-600">Yudisium semester ganjil</span>
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
                  >
                    Tentukan tanggal <span className="text-red-500">*</span>
                  </FormControl.Label>
                  <DatePicker
                    format={"DD MMMM YYYY"}
                    className={`w-[55%]`} placement="bottomLeft"
                    onChange={(date: Dayjs | null) => {
                      setDateInput(date ? dayjs(date).format("YYYY-MM-DD") : null);
                    }}
                  />
                  <FormControl.Caption className="">
                    Jika acara terdiri dari beberapa hari, cukup masukkan tanggal hari pertama. Misal: <span className="font-semibold text-blue-400">{dayjs().format("DD MMMM YYYY")}</span>
                  </FormControl.Caption>
                </FormControl>
              </Timeline.Body>
            </Timeline.Item>

            {/* NO. 3 */}
            <Timeline.Item>
              <Timeline.Badge className={`text-sm font-normal ${lora.className}`}>3</Timeline.Badge>
              <Timeline.Body>
                <FormControl aria-label="project-desc-field" className="flex-none">
                  <FormControl.Label>
                    Pilih berkas <span className="text-red-500">*</span>
                  </FormControl.Label>
                  <UploadDropbox
                    format="image/*"
                    onFileListChange={(fileList) => {
                      setFiles(fileList.map((f) => f.originFileObj).filter(Boolean) as File[]);
                    }}
                  />
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
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={isLoading || !nameInput.trim() || !dateInput}
                >
                  {isLoading ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </Timeline.Body>
            </Timeline.Item>
          </Timeline>
        </div>
      </main>
    </>
  )
}