"use client"

import { useCallback, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Text } from "@primer/react";
import { Dialog } from "@primer/react/experimental";
import { Building2, CalendarCheck, Info, Layers, MonitorDot, Sparkles } from "lucide-react";
import { lora, mona_sans, noto_sans, suse } from "@/lib/font";
import SelectedAgendaList, { type SelectedAgenda } from "@/components/manage_dasbor/selected-agenda-list";
import AgendaSelector, { type AvailableAgenda } from "@/components/manage_dasbor/agenda-selector";

// Import Day.js library and its matching locale
import dayjs from 'dayjs';
import 'dayjs/locale/id';

// Activate the Day.js locale globally
dayjs.locale('id');

export default function Page() {
  let { lantai = "" } = useParams<{ lantai: string }>();
  lantai = lantai.replace(/_/g, " ");

  // Query all agendas
  const {
    data: allAgendas,
    isLoading,
  } = useQuery({
    queryKey: ["manage-dasbor-agenda"],
    refetchOnMount: true,
    queryFn: async () => {
      // Simulated network delay
      await new Promise((r) => setTimeout(r, 600));
      return ALL_AGENDAS;
    },
  });

  // Selected agenda IDs (state)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(
    () => new Set(INITIAL_SELECTED[lantai] ?? [])
  );

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "add" | "remove";
    agenda: AvailableAgenda | null;
    triggerEl: HTMLElement | null;
  }>({ open: false, type: "add", agenda: null, triggerEl: null });

  // Derived lists
  const selectedAgendas: SelectedAgenda[] = useMemo(() => {
    if (!allAgendas) return [];
    return allAgendas.filter((a) => selectedIds.has(a.id));
  }, [allAgendas, selectedIds]);

  const availableAgendas: AvailableAgenda[] = useMemo(() => {
    if (!allAgendas) return [];
    return allAgendas.filter((a) => !selectedIds.has(a.id));
  }, [allAgendas, selectedIds]);

  // Handlers
  const handleSelect = useCallback((item: AvailableAgenda) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.add(item.id);
      return next;
    });
  }, []);

  const handleRemove = useCallback((id: number) => {
    const agenda = allAgendas?.find((a) => a.id === id);
    if (agenda) {
      setConfirmDialog({ open: true, type: "remove", agenda, triggerEl: null });
    }
  }, [allAgendas]);

  const confirmRemove = useCallback(() => {
    if (confirmDialog.agenda) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(confirmDialog.agenda!.id);
        return next;
      });
    }
    setConfirmDialog({ open: false, type: "remove", agenda: null, triggerEl: null });
  }, [confirmDialog.agenda]);

  const handleCloseDialog = useCallback(() => {
    setConfirmDialog({ open: false, type: "remove", agenda: null, triggerEl: null });
  }, []);

  // Format lantai for display
  const lantaiDisplay = lantai.replace(/\b\w/g, (c) => c.toUpperCase());
  const lantaiNum = lantai.replace(/\D/g, "");

  return (
    <>
      <main className="w-full min-h-[85vh] px-8 pt-5 pb-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            {/* Floor icon */}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-indigo-200/50">
              <Layers size={18} strokeWidth={2} />
              <span className={`absolute -bottom-0.5 -right-0.5 flex items-center justify-center w-4.5 h-4.5 rounded-md bg-white text-[10px] font-extrabold text-indigo-600 shadow-sm border border-indigo-100 ${suse.className}`}>
                {lantaiNum}
              </span>
            </div>
            <div>
              <h1 className={`text-xl font-bold text-gray-900 ${lora.className}`}>
                Dashboard {lantaiDisplay}
              </h1>
              <p className={`text-sm text-gray-400 ${noto_sans.className}`}>
                Kelola agenda yang ditampilkan di dashboard {lantai}
              </p>
            </div>
          </div>

          {/* Info banner */}
          <div className="mt-4 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200/60">
            <Info size={16} className="text-amber-500 mt-0.5 shrink-0" />
            <p className={`text-xs text-amber-700 leading-relaxed ${noto_sans.className}`}>
              Agenda yang dipilih akan tetap ditampilkan di dashboard hingga Anda menghapusnya secara manual.
              Perbarui daftar secara berkala agar informasi tetap relevan.
            </p>
          </div>
        </div>

        {/* Split-view Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {/* Panel Kiri: Agenda Terpilih */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-white to-gray-50/50 border border-gray-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 min-h-[55vh] max-h-[65vh] flex flex-col">
            {/* Decorative top bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-t-2xl" />
            <SelectedAgendaList
              items={selectedAgendas}
              onRemove={handleRemove}
              lantai={lantai}
            />
          </div>

          {/* Panel Kanan: Semua Agenda */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-white to-gray-50/50 border border-gray-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 min-h-[55vh] max-h-[65vh] flex flex-col">
            {/* Decorative top bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-400 via-indigo-400 to-violet-400 rounded-t-2xl" />
            <AgendaSelector
              items={availableAgendas}
              selectedIds={selectedIds}
              onSelect={handleSelect}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Bottom status bar */}
        <div className="mt-5 flex items-center justify-between px-5 py-3 rounded-xl bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-2">
            <MonitorDot size={14} className="text-gray-400" />
            <span className={`text-xs text-gray-500 ${noto_sans.className}`}>
              {selectedAgendas.length} agenda ditampilkan di dashboard {lantai}
            </span>
          </div>
        </div>
      </main>

      {/* Confirmation Dialog */}
      {confirmDialog.open && confirmDialog.agenda && (
        <Dialog
          title={
            <span className={`font-semibold ${mona_sans.className}`}>
              Hapus dari Dashboard
            </span>
          }
          onClose={handleCloseDialog}
          footerButtons={[
            {
              buttonType: "default",
              content: (
                <span className={`font-semibold ${mona_sans.className}`}>Batal</span>
              ),
              onClick: handleCloseDialog,
            },
            {
              buttonType: "danger",
              content: (
                <span className={`font-semibold ${mona_sans.className}`}>Hapus</span>
              ),
              onClick: confirmRemove,
            },
          ]}
        >
          <p className={`text-sm ${noto_sans.className}`}>
            Apakah Anda yakin ingin menghapus agenda{" "}
            <strong>"{confirmDialog.agenda.nama}"</strong> dari dashboard {lantai}?
          </p>
          <p className={`text-xs text-gray-400 mt-2 ${noto_sans.className}`}>
            Agenda ini dapat ditambahkan kembali kapan saja.
          </p>
        </Dialog>
      )}
    </>
  );
}

/** Dummy: agenda yang sudah terpilih per lantai */
const INITIAL_SELECTED: Record<string, number[]> = {
  "lantai 6": [1, 3],
  "lantai 7": [2, 5],
  "lantai 8": [4],
};

/** Dummy data: semua agenda yang ada di sistem */
const ALL_AGENDAS: AvailableAgenda[] = [
  {
    id: 1,
    nama: "Rapat Koordinasi Dosen",
    deskripsi: "Rapat rutin koordinasi dosen prodi TI",
    waktu: new Date(2026, 6, 25),
  },
  {
    id: 2,
    nama: "Seminar Nasional AI",
    deskripsi: "Seminar nasional kecerdasan buatan dan machine learning",
    waktu: new Date(2026, 6, 26),
  },
  {
    id: 3,
    nama: "Workshop IoT & Embedded Systems",
    deskripsi: "Pelatihan pengembangan IoT untuk dosen dan mahasiswa",
    waktu: new Date(2026, 6, 27),
  },
  {
    id: 4,
    nama: "Ujian Tengah Semester",
    deskripsi: "Pelaksanaan UTS semester ganjil 2026/2027",
    waktu: new Date(2026, 6, 28),
  },
  {
    id: 5,
    nama: "Kuliah Tamu: Cloud Computing",
    deskripsi: "Kuliah tamu oleh praktisi industri cloud",
    waktu: new Date(2026, 6, 29),
  },
  {
    id: 6,
    nama: "Pendaftaran KP & Skripsi",
    deskripsi: "Batas akhir pendaftaran kerja praktek dan tugas akhir",
    waktu: new Date(2026, 6, 30),
  },
  {
    id: 7,
    nama: "Lomba Hackathon JTI",
    deskripsi: "Kompetisi hackathon antar mahasiswa JTI",
    waktu: new Date(2026, 7, 1),
  },
  {
    id: 8,
    nama: "Dies Natalis Polinema",
    deskripsi: "Perayaan ulang tahun Politeknik Negeri Malang",
    waktu: new Date(2026, 7, 3),
  },
];
