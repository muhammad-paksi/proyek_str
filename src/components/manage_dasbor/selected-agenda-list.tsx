"use client";

import { useCallback } from "react";
import { CalendarCheck, CalendarX2, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { lora, mona_sans, noto_sans, suse } from "@/lib/font";

export type SelectedAgenda = {
  id: number;
  nama: string;
  deskripsi?: string | null;
  waktu: Date;
  fileCount?: number;
};

interface SelectedAgendaListProps {
  items: SelectedAgenda[];
  onRemove: (id: number) => void;
  onReorder?: (id: number, direction: 'up' | 'down') => void;
  lantai: string;
  readOnly?: boolean;
}

export default function SelectedAgendaList({ items, onRemove, onReorder, lantai, readOnly = false }: SelectedAgendaListProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
            <CalendarCheck size={16} className="text-emerald-600" />
          </div>
          <div>
            <h3 className={`text-sm font-semibold text-gray-800 ${mona_sans.className}`}>
              Agenda Terpilih
            </h3>
            <p className={`text-xs text-gray-400 ${noto_sans.className}`}>
              Ditampilkan di dashboard
            </p>
          </div>
        </div>
        {items.length > 0 && (
          <span className={`inline-flex items-center justify-center min-w-6 h-6 px-2 text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-full ${suse.className}`}>
            {items.length}
          </span>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 opacity-70">
            <div className="p-4 rounded-2xl bg-gray-50 border border-dashed border-gray-200 mb-4">
              <CalendarX2 size={32} className="text-gray-350" />
            </div>
            <p className={`text-sm font-medium text-gray-400 mb-1 ${mona_sans.className}`}>
              Belum ada agenda terpilih
            </p>
            <p className={`text-xs text-gray-350 text-center max-w-56 ${noto_sans.className}`}>
              Pilih agenda dari panel sebelah kanan untuk ditampilkan di dashboard {lantai}.
            </p>
          </div>
        ) : (
          items.map((item, index) => {
            const date = item.waktu instanceof Date ? item.waktu : new Date(item.waktu);
            return (
              <div
                key={item.id}
                className="group relative flex items-start gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:border-emerald-200 transition-all duration-200 ease-out animate-[slideInLeft_0.3s_ease-out]"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
              >
                {/* Number badge */}
                <div className={`shrink-0 flex items-center justify-center w-7 h-7 mt-0.5 rounded-lg bg-linear-to-br from-emerald-400 to-teal-500 text-white text-xs font-bold shadow-sm ${suse.className}`}>
                  {index + 1}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold text-gray-800 truncate ${mona_sans.className}`}>
                    {item.nama}
                  </p>
                  {item.deskripsi && (
                    <p className={`text-xs text-gray-400 truncate mt-0.5 ${noto_sans.className}`}>
                      {item.deskripsi}
                    </p>
                  )}
                  <p className={`text-[11px] text-gray-400 mt-1 ${suse.className}`}>
                    {date.toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Actions */}
                {!readOnly && (
                  <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-150">
                    <div className="flex flex-col">
                      <button
                        onClick={() => onReorder?.(item.id, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                        title="Geser ke atas"
                      >
                        <ArrowUp size={14} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => onReorder?.(item.id, 'down')}
                        disabled={index === items.length - 1}
                        className="p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                        title="Geser ke bawah"
                      >
                        <ArrowDown size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="p-1.5 ml-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                      title="Hapus dari dashboard"
                    >
                      <Trash2 size={15} strokeWidth={2} />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer info */}
      {items.length > 0 && !readOnly && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className={`text-[11px] text-gray-400 text-center ${noto_sans.className}`}>
            Agenda akan tetap tampil hingga dihapus secara manual.
          </p>
        </div>
      )}
    </div>
  );
}
