"use client";

import { useMemo, useState } from "react";
import { Text } from "@primer/react";
import { DatePicker, Input, type GetProps, Empty } from "antd";
import { CalendarPlus, Calendar1, Check, ListFilter, Plus, Search as SearchIcon } from "lucide-react";
import dayjs, { Dayjs } from "dayjs";
import { lora, mona_sans, noto_sans, suse } from "@/lib/font";

export type AvailableAgenda = {
  id: number;
  nama: string;
  deskripsi?: string | null;
  waktu: Date;
  fileCount?: number;
};

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

interface AgendaSelectorProps {
  items: AvailableAgenda[];
  selectedIds: Set<number>;
  onSelect: (item: AvailableAgenda) => void;
  isLoading?: boolean;
  readOnly?: boolean;
}

export default function AgendaSelector({ items, selectedIds, onSelect, isLoading, readOnly = false }: AgendaSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const filteredItems = useMemo(() => {
    let result = items;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.nama.toLowerCase().includes(query) ||
          item.deskripsi?.toLowerCase().includes(query)
      );
    }

    if (selectedDate) {
      const dateStr = selectedDate.format("YYYY-MM-DD");
      result = result.filter((item) => {
        const itemDate = item.waktu instanceof Date ? item.waktu : new Date(item.waktu);
        return dayjs(itemDate).format("YYYY-MM-DD") === dateStr;
      });
    }

    return result;
  }, [items, searchQuery, selectedDate]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-200">
            <ListFilter size={16} className="text-blue-600" />
          </div>
          <div>
            <h3 className={`text-sm font-semibold text-gray-800 ${mona_sans.className}`}>
              Daftar Agenda
            </h3>
            <p className={`text-xs text-gray-400 ${noto_sans.className}`}>
              Pilih untuk ditampilkan
            </p>
          </div>
        </div>
        <span className={`inline-flex items-center justify-center min-w-6 h-6 px-2 text-xs font-bold text-blue-700 bg-blue-100 border border-blue-200 rounded-full ${suse.className}`}>
          {items.length}
        </span>
      </div>

      {/* Search */}
      <div className="mb-3 flex gap-3 items-center justify-end">
        <DatePicker 
          format={"DD MMM YYYY"} 
          placeholder="Pilih Tanggal" 
          className="w-xs" 
          suffixIcon={<Calendar1 className="text-blue-400" size={16} strokeWidth={2} />} 
          value={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          allowClear
          disabled={readOnly}
        />
        <Search
          placeholder="Cari nama agenda..."
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          allowClear
          enterButton={false}
          className="agenda-search"
          disabled={readOnly}
        />
      </div>

      {/* List */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
        {isLoading ? (
          // Skeleton loading
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-gray-50 border border-gray-100 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                  <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 opacity-70">
            <div className="p-4 rounded-2xl bg-gray-50 border border-dashed border-gray-200 mb-4">
              <SearchIcon size={32} className="text-gray-300" />
            </div>
            <p className={`text-sm font-medium text-gray-400 mb-1 ${mona_sans.className}`}>
              {searchQuery ? "Tidak ditemukan" : "Semua agenda sudah dipilih"}
            </p>
            <p className={`text-xs text-gray-350 text-center max-w-56 ${noto_sans.className}`}>
              {(searchQuery || selectedDate)
                ? `Tidak ada agenda yang cocok dengan pencarian Anda.`
                : "Semua agenda sudah ditambahkan ke dashboard."}
            </p>
          </div>
        ) : (
          filteredItems.map((item, index) => {
            const date = item.waktu instanceof Date ? item.waktu : new Date(item.waktu);
            const isSelected = selectedIds.has(item.id);

            return (
              <div
                key={item.id}
                className={`group relative flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 ease-out animate-[fadeIn_0.25s_ease-out] ${isSelected ? "bg-emerald-50/50 border-emerald-200 opacity-60 pointer-events-none" : readOnly ? "bg-white border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] opacity-70 pointer-events-none" : "bg-white border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:border-blue-200 cursor-pointer"}`}
                style={{ animationDelay: `${index * 30}ms`, animationFillMode: "both" }}
                onClick={() => !readOnly && !isSelected && onSelect(item)}
              >
                {/* Icon / Initial */}
                <div className={`shrink-0 flex items-center justify-center w-8 h-8 mt-0.5 rounded-lg text-xs font-bold shadow-sm ${isSelected ? "bg-emerald-100 text-emerald-600" : "bg-linear-to-br from-blue-400 to-indigo-500 text-white"} ${suse.className}`}>
                  {isSelected ? (
                    <Check size={14} strokeWidth={3} />
                  ) : (
                    item.nama.charAt(0).toUpperCase()
                  )}
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

                {/* Add button */}
                {!isSelected && !readOnly && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(item);
                    }}
                    className="shrink-0 p-1.5 rounded-lg text-gray-300 hover:text-blue-600 hover:bg-blue-50 opacity-0 group-hover:opacity-100 transition-all duration-150 cursor-pointer"
                    title="Tambahkan ke dashboard"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer count */}
      {filteredItems.length > 0 && searchQuery && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className={`text-[11px] text-gray-400 text-center ${noto_sans.className}`}>
            Menampilkan {filteredItems.length} dari {items.length} agenda
          </p>
        </div>
      )}
    </div>
  );
}
