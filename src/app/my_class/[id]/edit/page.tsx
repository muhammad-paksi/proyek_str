"use client"

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Select } from "antd";
import { useRipple } from 'use-ripple-hook';
import { Button, FormControl, Text, Timeline } from '@primer/react';
import { lora } from "@/lib/font";
import { getPelaksanaanDetail, getRuangList, updatePelaksanaan } from "@/server/actions/my-class";

const STATUS_OPTIONS = [
  { value: 0, label: "Belum dikonfirmasi" },
  { value: 1, label: "Offline" },
  { value: 2, label: "Online" },
  { value: 3, label: "Reschedule" },
  { value: 4, label: "Kosong" },
  { value: 5, label: "Dibatalkan" },
];

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [rippleOnSubmit, eventOnSubmit] = useRipple({ color: "rgba(0, 0, 0, 0.2)" });

  const [isLoading, setIsLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const [ruangInput, setRuangInput] = useState<string | null>(null);
  const [statusInput, setStatusInput] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: ruangList = [] } = useQuery({
    queryKey: ["ruangList"],
    queryFn: () => getRuangList(),
  });

  const {
    data: detail,
    isLoading: isDetailLoading,
  } = useQuery({
    queryKey: ["pelaksanaan-detail", id],
    refetchOnMount: true,
    queryFn: async () => {
      const data = await getPelaksanaanDetail(Number(id));
      if (!data) return null;

      if (!initialized) {
        setRuangInput(data.kodeRuang);
        setStatusInput(data.status);
        setInitialized(true);
      }

      return data;
    },
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await updatePelaksanaan({
        id: Number(id),
        kodeRuang: ruangInput,
        status: statusInput,
      });

      await queryClient.invalidateQueries({ queryKey: ["my-class-pelaksanaan"] });
      router.push("/my_class");
    } catch (e: any) {
      console.error("Failed to update pelaksanaan:", e);
      setErrorMsg(e.message || "Gagal memperbarui data pelaksanaan");
    } finally {
      setIsLoading(false);
    }
  };

  if (isDetailLoading) return <div className="p-10">Memuat data...</div>;

  return (
    <main className="border-r-0 border-r-red-400 w-full overflow-hidden pl-20 pb-20">
      <div className="h-fit max-w-md flex flex-col gap-4 pt-8 pb-2 px-4 border-r-0 border-r-gray-400 border-0 font-sans bg-white">
        <div>
          <h2 className={`mb-1 text-xl font-semibold ${lora.className}`}>
            Edit pelaksanaan
          </h2>
          <Text size="medium" weight="normal" className="block text-neutral-500">
            {detail?.mata_kuliah} &middot; {detail?.jam_pelajaran}
          </Text>
          {errorMsg && (
            <div className="mt-2 text-sm text-red-500 font-semibold bg-red-50 p-2 rounded border border-red-200">
              {errorMsg}
            </div>
          )}
        </div>

        <Timeline clipSidebar>
          {/* NO. 1 - Ruang */}
          <Timeline.Item>
            <Timeline.Badge className={`text-sm font-normal ${lora.className}`}>1</Timeline.Badge>
            <Timeline.Body className="border-0">
              <FormControl aria-label="ruang-field" className="flex-none border-0">
                <FormControl.Label>
                  Ruang
                </FormControl.Label>
                <Select
                  placeholder="Pilih ruang"
                  style={{ width: 200 }}
                  onChange={(val) => setRuangInput(val)}
                  value={ruangInput}
                  options={ruangList}
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                  }
                />
              </FormControl>
            </Timeline.Body>
          </Timeline.Item>

          {/* NO. 2 - Status */}
          <Timeline.Item>
            <Timeline.Badge className={`text-sm font-normal ${lora.className}`}>2</Timeline.Badge>
            <Timeline.Body className="border-0">
              <FormControl aria-label="status-field" className="flex-none border-0">
                <FormControl.Label>
                  Status
                </FormControl.Label>
                <Select
                  placeholder="Pilih status"
                  style={{ width: 200 }}
                  onChange={(val) => setStatusInput(val)}
                  value={statusInput}
                  options={STATUS_OPTIONS}
                />
              </FormControl>
            </Timeline.Body>
          </Timeline.Item>

          {/* NO. 3 - Simpan */}
          <Timeline.Item className="flex items-end">
            <Timeline.Badge className={`text-sm font-normal ${lora.className}`}>3</Timeline.Badge>
            <Timeline.Body>
              <Button
                variant="primary"
                className="bg-blue-500!"
                onClick={handleSubmit}
                disabled={isLoading}
                ref={rippleOnSubmit}
                onPointerDown={eventOnSubmit}
              >
                {isLoading ? "Menyimpan..." : "Perbarui"}
              </Button>
            </Timeline.Body>
          </Timeline.Item>
        </Timeline>
      </div>
    </main>
  );
}