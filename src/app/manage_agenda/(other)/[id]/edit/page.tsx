"use client"

import { useState } from "react";
import { DatePicker } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, FormControl, Text, TextInput, Timeline } from '@primer/react';
import { lora } from "@/lib/font";
import UploadEditGallery from "@/components/manage_agenda/upload-edit-gallery";
import { getAgendaDetail, updateAgenda, uploadAgendaFiles } from "@/server/agenda";
import dayjs, { type Dayjs } from 'dayjs';
import 'dayjs/locale/id';
import { Plus, Trash } from "lucide-react";

dayjs.locale('id');

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [nameInput, setNameInput] = useState<string>('');
  const [dateInput, setDateInput] = useState<string | null>(null);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const {
    data: agendaDetail,
    isLoading: isDetailLoading,
  } = useQuery({
    queryKey: ["manage-agenda", id],
    refetchOnMount: true,
    queryFn: async () => {
      const result = await getAgendaDetail({ id: Number(id) });
      if (!result?.data) return null;

      const data = result.data;
      // Initialize form values once
      if (!initialized) {
        setNameInput(data.nama ?? '');
        setDateInput(data.waktu instanceof Date
          ? dayjs(data.waktu).format("YYYY-MM-DD")
          : String(data.waktu)
        );
        setInitialized(true);
      }

      return {
        id: data.id,
        nama: data.nama ?? '',
        waktu: data.waktu instanceof Date
          ? dayjs(data.waktu).format("YYYY-MM-DD")
          : String(data.waktu),
        imageList: data.imageList,
        deskripsi: data.deskripsi ?? undefined,
      };
    }
  });

  const handleSubmit = async () => {
    if (!nameInput.trim() || !dateInput) return;
    setIsLoading(true);
    try {
      await updateAgenda({
        id: Number(id),
        nama: nameInput.trim(),
        waktu: dateInput,
        deletedFileIds: deletedImageIds,
      });

      // Upload new files
      if (newFiles.length > 0) {
        const formData = new FormData();
        formData.set("agendaId", String(id));
        for (const file of newFiles) {
          formData.append("files", file);
        }
        await uploadAgendaFiles(formData);
      }

      await queryClient.invalidateQueries({ queryKey: ["manage-agenda"] });
      router.push(`/manage_agenda/${id}/view`);
    } catch (e) {
      console.error("Failed to update agenda:", e);
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
              Edit poster agenda
            </h2>
            <Text size="medium" weight="normal" className="block text-neutral-500">
              Perbarui detail agenda yang ingin diubah.&#10;
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
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className={`w-full`}
                  />
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
                  >
                    Tentukan tanggal <span className="text-red-500">*</span>
                  </FormControl.Label>
                  <DatePicker
                    format={"DD MMMM YYYY"}
                    value={dateInput ? dayjs(dateInput) : undefined}
                    className={`w-[55%]`} placement="bottomLeft"
                    onChange={(date: Dayjs | null) => {
                      setDateInput(date ? dayjs(date).format("YYYY-MM-DD") : null);
                    }}
                  />
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
                  <FormControl.Label>
                    Berkas poster <span className="text-red-500">*</span>
                  </FormControl.Label>
                  <UploadEditGallery
                    existingImages={agendaDetail?.imageList}
                    format="image/*"
                    onDeleteExisting={(ids) => setDeletedImageIds(ids)}
                    onFileListChange={(fileList) => {
                      // Extract only newly added File objects (not existing server images)
                      const newOnes = fileList
                        .filter((f) => !f.uid.startsWith('existing-') && f.originFileObj)
                        .map((f) => f.originFileObj as File);
                      setNewFiles(newOnes);
                    }}
                  />
                  <FormControl.Caption className="mt-3! w-full border-0">
                    Klik{" "}
                    <div className="inline-flex items-center align-middle">
                      <Trash size={14} strokeWidth={2} />
                    </div>pada gambar untuk menghapus.
                    Klik{" "} 
                    <span className="inline-flex items-center align-middle">
                      <Plus size={14} strokeWidth={2} />
                    </span> untuk menambahkan.
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
                  className="bg-blue-500!"
                  onClick={handleSubmit}
                  disabled={isLoading || !nameInput.trim() || !dateInput}
                >
                  {isLoading ? 'Memperbarui...' : 'Perbarui'}
                </Button>
              </Timeline.Body>
            </Timeline.Item>
          </Timeline>
        </div>
      </main>
    </>
  )
}