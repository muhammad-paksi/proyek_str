"use client"

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import Header from "@/components/header";
import Tooltip from "@mui/material/Tooltip";
import { Menu } from "lucide-react";
import { Table } from "@heroui/react";
import { Button, message } from 'antd'
import { lora, suse } from "@/lib/font";
import { useRowHeights } from "@/lib/useRowHeight";
import { getDasborData, mulaiKelas } from "@/server/dasbor-view";

export default function Page() {
  const params = useParams<{ lantai: string }>();
  const lantaiNum = params?.lantai ? parseInt(params.lantai.replace('lantai_', ''), 10) : 6;

  const [images, setImages] = useState<string[]>([]);
  const [pelaksanaan, setPelaksanaan] = useState<any[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { rowHeights, setRowRef } = useRowHeights();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, [lantaiNum]);

  const fetchData = async () => {
    setLoading(true);
    const res = await getDasborData({ lantai: lantaiNum });
    if (res?.data) {
      setImages(res.data.images);
      setPelaksanaan(res.data.pelaksanaan);
      setRole(res.data.role);
    }
    setLoading(false);
  };

  // Logic Carousel / Slideshow
  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  useEffect(() => {
    const container = tableRef.current;
    if (!container || pelaksanaan.length === 0) return;
  
    // const rowHeight = 40 * 4; // kira-kira tinggi 4 baris
    /* Below using real time row height as alternative to the above statement  */
    const rowHeight = 40 * 10; // kira-kira tinggi 4 baris
    const duration = 5000; // scroll tiap 5 detik

    const interval = setInterval(() => {
      if (!container) return;

      // kalau udah di bawah banget, reset ke atas
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
        container.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ top: rowHeight, behavior: "smooth" });
      }
    }, duration);

    return () => clearInterval(interval);
  }, [pelaksanaan]);

  const handleMulaiKelas = async () => {
    const res = await mulaiKelas();
    if (res?.data?.success) {
      message.success("Kelas berhasil dimulai");
      fetchData(); // Refresh data
    } else {
      message.error(res?.data?.message || "Gagal memulai kelas");
    }
  };

  return (
    <>
      <Header />

      <main className="w-full h-[92vh] grid grid-cols-7 pl-5 pr-5 ">
        {/* KIRI - SLIDESHOW AGENDA */}
        <div className="col-span-3 pr-3 border-e border-e-gray-300 relative overflow-hidden flex items-center justify-center bg-gray-100">
          {loading ? (
            <div className="text-gray-500">Memuat...</div>
          ) : images.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={images[currentImageIndex]}
              alt="Agenda"
              className="object-contain w-full h-full"
            />
          ) : (
            <div className={`text-gray-500 text-sm ${suse.className}`}>Tidak ada gambar agenda</div>
          )}
        </div>

        {/* KANAN - TABEL PELAKSANAAN */}
        <div className="col-span-4 pl-4 flex flex-col h-full py-4">
          <h2 className={`text-xl font-semibold mb-4 ${lora.className}`}>Kelas hari ini</h2>

          {loading ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Memuat...
            </div>
          ) : pelaksanaan.length > 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <table className="w-full table-fixed border-collapse text-left text-sm text-slate-700">
                <thead className="bg-blue-50 text-slate-600 uppercase text-xs font-semibold">
                  <tr>
                    <th className="w-[7%] py-3 px-4">No.</th>
                    <th className="w-[15%] py-3 px-4">Kelas</th>
                    <th className="w-[23%] py-3 px-4">Mata Kuliah</th>
                    <th className="w-[20%] py-3 px-4">Jam</th>
                    <th className="w-[15%] py-3 px-4">Ruang</th>
                    <th className="w-[20%] py-3 px-4">Status</th>
                  </tr>
                </thead>
              </table>

              {/* Body */}
              <div
                // ref={scrollRef}
                ref={tableRef}
                className="h-90 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:bg-slate-300"
              >
                <table className="w-full table-fixed border-collapse text-left text-sm text-slate-700">
                  <tbody className="divide-y divide-slate-100">
                    {pelaksanaan.map((item, idx) => {
                      let statusText = "Belum dikonfirmasi";
                      let badgeClass = "bg-slate-100 text-slate-600 border border-slate-200";
                      switch (Number(item.status)) {
                        case 1: statusText = "Offline"; badgeClass = "bg-emerald-50 text-emerald-700 border border-emerald-200"; break;
                        case 2: statusText = "Online"; badgeClass = "bg-blue-50 text-blue-700 border border-blue-200"; break;
                        case 3: statusText = "Pindah"; badgeClass = "bg-amber-50 text-amber-700 border border-amber-200"; break;
                        case 4: statusText = "Kosong"; badgeClass = "bg-rose-50 text-rose-700 border border-rose-200"; break;
                        case 5: statusText = "Dibatalkan"; badgeClass = "bg-slate-100 text-slate-700 border border-slate-200"; break;
                      }

                      return (
                        <tr 
                          key={item.id} 
                          ref={setRowRef(item.id)} // Assign ref
                          className="hover:bg-slate-50/80 transition-colors duration-200"
                        >
                          <td className="w-[7%] py-3 px-4 font-semibold text-slate-900">{idx + 1}.</td>
                          <td className="w-[15%] py-3 px-4 font-medium text-slate-900">{item.kelas.replace(/_/g, " ")}</td>
                          <td className="w-[23%] py-3 px-4">
                            <div className="truncate" title={item.mataKuliah}>{item.mataKuliah}</div>
                          </td>
                          <td className={`w-[20%] py-3 px-4 whitespace-nowrap text-slate-600 ${suse.className}`}>
                            {item.jamMulai?.slice(0, 5)} - {item.jamSelesai?.slice(0, 5)}
                          </td>
                          <td className="w-[15%] py-3 px-4 text-slate-600">{item.ruang || "-"}</td>
                          <td className="w-[20%] py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${badgeClass}`}>
                              {statusText}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              {role === "admin" ? (
                <div className="text-center">
                  <p className={`mb-4 text-gray-600 text-base ${suse.className}`}>Tabel pelaksanaan untuk hari ini kosong.</p>
                  <Button type="primary" onClick={handleMulaiKelas} size="large">
                    Mulai Kelas
                  </Button>
                </div>
              ) : (
                <div className={`text-gray-500 text-base ${suse.className}`}>
                  Tidak ada jadwal kuliah untuk ditampilkan
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  )
}

 // Logic Auto-scroll Table
  // useEffect(() => {
  //   if (!scrollRef.current || pelaksanaan.length === 0) return;

  //   let animationFrameId: number;
  //   let scrollAmount = 0;
  //   const speed = 2; // pixels per frame

  //   const scroll = () => {
  //     if (scrollRef.current) {
  //       const { scrollHeight, clientHeight } = scrollRef.current;
  //       if (scrollHeight > clientHeight) {
  //         scrollAmount += speed;
  //         if (scrollAmount >= scrollHeight - clientHeight) {
  //           scrollAmount = 0;
  //         }
  //         scrollRef.current.scrollTop = scrollAmount;
  //       }
  //     }
  //     animationFrameId = requestAnimationFrame(scroll);
  //   };

  //   animationFrameId = requestAnimationFrame(scroll);

  //   return () => cancelAnimationFrame(animationFrameId);
  // }, [pelaksanaan]);