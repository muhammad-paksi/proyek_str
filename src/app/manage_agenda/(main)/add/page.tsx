"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { DatePicker, TimePicker } from "antd";
import { useRipple } from 'use-ripple-hook';
import { Button, FormControl, Text, TextInput, Timeline, Select } from '@primer/react';
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
  const [tempatInput, setTempatInput] = useState('');
  const [waktuMulaiInput, setWaktuMulaiInput] = useState<string | null>(null);
  const [waktuSelesaiInput, setWaktuSelesaiInput] = useState<string | null>(null);
  const [lantaiInput, setLantaiInput] = useState<string>('');
  const [dateInput, setDateInput] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = async () => {
    if (!nameInput.trim() || !dateInput) return;
    setIsLoading(true);
    try {
      const result = await createAgenda({
        nama: nameInput.trim(),
        waktu: dateInput,
        tempat: tempatInput.trim() || undefined,
        waktuMulai: waktuMulaiInput || undefined,
        waktuSelesai: waktuSelesaiInput || undefined,
        lantai: lantaiInput ? Number(lantaiInput) : undefined,
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
              <Timeline.Body>
                <div className="flex gap-4 w-full">
                  <FormControl aria-label="tempat-field" className="flex-1">
                    <FormControl.Label>
                      Tempat
                    </FormControl.Label>
                    <TextInput
                      className={`w-full`}
                      value={tempatInput}
                      onChange={(e) => setTempatInput(e.target.value)}
                    />
                  </FormControl>

                  <FormControl aria-label="lantai-field" className="w-30">
                    <FormControl.Label>
                      Lantai
                    </FormControl.Label>
                    <Select
                      className="w-full"
                      value={lantaiInput}
                      onChange={(e) => setLantaiInput(e.target.value)}
                    >
                      {/* <Select.Option value="5">Lantai 5</Select.Option> */}
                      <Select.Option value="6">Lantai 6</Select.Option>
                      <Select.Option value="7">Lantai 7</Select.Option>
                      <Select.Option value="8">Lantai 8</Select.Option>
                    </Select>
                  </FormControl>
                </div>
              </Timeline.Body>
            </Timeline.Item>

            {/* NO. 3 */}
            <Timeline.Item>
              <Timeline.Badge className={`text-sm font-normal ${lora.className}`}>3</Timeline.Badge>
              <Timeline.Body className="border-0">
                <FormControl aria-label="project-date-field" className="flex-none border-0 border-red-500">
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

            {/* NO. 4 */}
            <Timeline.Item>
              <Timeline.Badge className={`text-sm font-normal ${lora.className}`}>4</Timeline.Badge>
              <Timeline.Body>
                <div className="flex gap-4">
                  <FormControl aria-label="waktu-mulai-field" className="flex-1">
                    <FormControl.Label>Waktu Mulai</FormControl.Label>
                    <TimePicker 
                      format="HH:mm" 
                      className="w-full"
                      onChange={(time: Dayjs | null) => setWaktuMulaiInput(time ? time.format("HH:mm") : null)} 
                    />
                  </FormControl>

                  <FormControl aria-label="waktu-selesai-field" className="flex-1">
                    <FormControl.Label>Waktu Selesai</FormControl.Label>
                    <TimePicker 
                      format="HH:mm" 
                      className="w-full"
                      onChange={(time: Dayjs | null) => setWaktuSelesaiInput(time ? time.format("HH:mm") : null)} 
                    />
                  </FormControl>
                </div>
              </Timeline.Body>
            </Timeline.Item>

            {/* NO. 5 */}
            <Timeline.Item>
              <Timeline.Badge className={`text-sm font-normal ${lora.className}`}>5</Timeline.Badge>
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

            {/* NO. 6 */}
            <Timeline.Item className="flex items-end">
              <Timeline.Badge className={`text-sm font-normal ${lora.className}`}>6</Timeline.Badge>
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