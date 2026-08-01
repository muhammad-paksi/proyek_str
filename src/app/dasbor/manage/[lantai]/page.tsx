"use client"

import { useCallback, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Text } from "@primer/react";
import { Dialog } from "@primer/react/experimental";
import { Building2, CalendarCheck, Info, Layers, MonitorDot, Sparkles } from "lucide-react";
import { lora, mona_sans, noto_sans, suse } from "@/lib/font";
import Header from "@/components/manage_dasbor/header";
import SelectedAgendaList, { type SelectedAgenda } from "@/components/manage_dasbor/selected-agenda-list";
import AgendaSelector, { type AvailableAgenda } from "@/components/manage_dasbor/agenda-selector";
import { getAgendaList } from "@/server/agenda";
import { getDasborAgendaList, saveDasborAgenda } from "@/server/dasbor";

// Import Day.js library and its matching locale
import dayjs from 'dayjs';
import 'dayjs/locale/id';

// Activate the Day.js locale globally
dayjs.locale('id');

export default function Page() {
  let { lantai = "" } = useParams<{ lantai: string }>();
  lantai = lantai.replace(/_/g, " ");

  const queryClient = useQueryClient();

  // Format lantai for display and numeric values
  const lantaiDisplay = lantai.replace(/\b\w/g, (c) => c.toUpperCase());
  const lantaiNum = Number(lantai.replace(/\D/g, ""));

  // Query all agendas
  const {
    data: allAgendas,
    isLoading: isLoadingAll,
  } = useQuery({
    queryKey: ["manage-agenda"],
    refetchOnMount: true,
    queryFn: async () => {
      const res = await getAgendaList();
      return (res?.data ?? []).map(a => ({
        ...a,
        deskripsi: a.deskripsi,
        nama: a.nama ?? "Tanpa Nama",
      }));
    },
  });

  // Query saved agenda IDs for this floor
  const {
    data: savedAgendaIds,
    isLoading: isLoadingSaved,
  } = useQuery({
    queryKey: ["manage-dasbor-agenda", lantaiNum],
    refetchOnMount: true,
    queryFn: async () => {
      const res = await getDasborAgendaList({ lantai: lantaiNum });
      return res?.data ?? [];
    },
  });

  const isLoading = isLoadingAll || isLoadingSaved;

  // Saved agenda IDs (persistent state across edits)
  const [savedIds, setSavedIds] = useState<number[]>([]);

  // Selected agenda IDs (draft state)
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Update local state when DB fetch completes
  useMemo(() => {
    if (savedAgendaIds) {
      setSavedIds(savedAgendaIds);
      setSelectedIds(savedAgendaIds);
    }
  }, [savedAgendaIds]);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "add" | "remove";
    agenda: AvailableAgenda | null;
    triggerEl: HTMLElement | null;
  }>({ open: false, type: "add", agenda: null, triggerEl: null });

  const selectedAgendas: SelectedAgenda[] = useMemo(() => {
    if (!allAgendas) return [];
    const result: SelectedAgenda[] = [];
    for (const id of selectedIds) {
      const a = allAgendas.find(item => item.id === id);
      if (a) {
        result.push({
          id: a.id,
          nama: a.nama ?? "Tanpa Nama",
          deskripsi: a.deskripsi ?? null,
          waktu: a.waktu,
          fileCount: a.fileCount,
        });
      }
    }
    return result;
  }, [allAgendas, selectedIds]);

  const availableAgendas: AvailableAgenda[] = useMemo(() => {
    if (!allAgendas) return [];
    const idSet = new Set(selectedIds);
    return allAgendas
      .filter((a) => !idSet.has(a.id))
      .map(a => ({
        id: a.id,
        nama: a.nama ?? "Tanpa Nama",
        deskripsi: a.deskripsi ?? null,
        waktu: a.waktu,
        fileCount: a.fileCount,
      }));
  }, [allAgendas, selectedIds]);

  // Handlers
  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setSelectedIds([...savedIds]);
  }, [savedIds]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setSelectedIds([...savedIds]);
  }, [savedIds]);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    console.log("Lihat", selectedIds)
    try {
      await saveDasborAgenda({
        lantai: lantaiNum,
        agendaIds: selectedIds,
      });
      setSavedIds([...selectedIds]);
      await queryClient.invalidateQueries({ queryKey: ["manage-dasbor-agenda", lantaiNum] });
      setIsEditing(false);
    } catch (e) {
      console.error("Failed to save dashboard agendas:", e);
    } finally {
      setIsSaving(false);
    }
  }, [selectedIds, lantaiNum, queryClient]);

  const handleSelect = useCallback((item: AvailableAgenda) => {
    if (!isEditing) return;
    setSelectedIds((prev) => {
      if (prev.includes(item.id)) return prev;
      return [...prev, item.id];
    });
  }, [isEditing]);

  const handleRemove = useCallback((id: number) => {
    const agenda = allAgendas?.find((a) => a.id === id);
    if (agenda) {
      setConfirmDialog({ open: true, type: "remove", agenda, triggerEl: null });
    }
  }, [allAgendas]);

  const confirmRemove = useCallback(() => {
    if (confirmDialog.agenda) {
      setSelectedIds((prev) => prev.filter(id => id !== confirmDialog.agenda!.id));
    }
    setConfirmDialog({ open: false, type: "remove", agenda: null, triggerEl: null });
  }, [confirmDialog.agenda]);

  const handleReorder = useCallback((id: number, direction: 'up' | 'down') => {
    setSelectedIds((prev) => {
      const idx = prev.indexOf(id);
      if (idx < 0) return prev;
      if (direction === 'up' && idx > 0) {
        const next = [...prev];
        next[idx] = next[idx - 1];
        next[idx - 1] = id;
        return next;
      }
      if (direction === 'down' && idx < prev.length - 1) {
        const next = [...prev];
        next[idx] = next[idx + 1];
        next[idx + 1] = id;
        return next;
      }
      return prev;
    });
  }, []);

  const handleCloseDialog = useCallback(() => {
    setConfirmDialog({ open: false, type: "remove", agenda: null, triggerEl: null });
  }, []);

  // Floor logic handled above

  return (
    <>
      <main className="w-full min-h-[85vh] px-8 pt-5 pb-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
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

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mt-1">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className={`px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors ${mona_sans.className}`}
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors disabled:opacity-50 ${mona_sans.className}`}
                  >
                    {isSaving ? "Menyimpan..." : "Simpan"}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className={`px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors ${mona_sans.className}`}
                >
                  Edit Dashboard
                </button>
              )}
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
          {/* Panel Kiri */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-white to-gray-50/50 border border-gray-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 h-[65vh] min-h-0 flex flex-col">
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-t-2xl" />

            <SelectedAgendaList
              items={selectedAgendas}
              onRemove={handleRemove}
              onReorder={handleReorder}
              lantai={lantai}
              readOnly={!isEditing}
            />
          </div>

          {/* Panel Kanan */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-white to-gray-50/50 border border-gray-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 h-[65vh] min-h-0 flex flex-col">
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-400 via-indigo-400 to-violet-400 rounded-t-2xl" />

            <AgendaSelector
              items={availableAgendas}
              selectedIds={new Set(selectedIds)}
              onSelect={handleSelect}
              isLoading={isLoading}
              readOnly={!isEditing}
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
