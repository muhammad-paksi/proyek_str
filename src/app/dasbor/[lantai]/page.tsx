"use client"

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Menu } from "lucide-react";
import { Button, message } from 'antd'
import Header from "@/components/header";
import Tooltip from "@mui/material/Tooltip";
import { suse } from "@/lib/font";
import { getDasborData, mulaiKelas } from "@/server/dasbor-view";

export default function Page() {
  const params = useParams<{ lantai: string }>();
  const lantaiNum = params?.lantai ? parseInt(params.lantai.replace('lantai_', ''), 10) : 6;

  const [images, setImages] = useState<string[]>([]);
  const [pelaksanaan, setPelaksanaan] = useState<any[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  // Logic Auto-scroll Table
  useEffect(() => {
    if (!scrollRef.current || pelaksanaan.length === 0) return;
    
    let animationFrameId: number;
    let scrollAmount = 0;
    const speed = 2; // pixels per frame

    const scroll = () => {
      if (scrollRef.current) {
        const { scrollHeight, clientHeight } = scrollRef.current;
        if (scrollHeight > clientHeight) {
          scrollAmount += speed;
          if (scrollAmount >= scrollHeight - clientHeight) {
            scrollAmount = 0;
          }
          scrollRef.current.scrollTop = scrollAmount;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
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

      <main className="w-screen h-[93vh] grid grid-cols-7 pl-6 pr-5 ">
        {/* KIRI - SLIDESHOW AGENDA */}
        <div className="col-span-3 border-e border-e-gray-300 relative overflow-hidden flex items-center justify-center bg-gray-100">
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
           <h2 className={`text-xl font-bold mb-4 ${suse.className}`}>Pelaksanaan Kelas Hari Ini</h2>
           
           {loading ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Memuat...
              </div>
           ) : pelaksanaan.length > 0 ? (
             <div className="flex-1 flex flex-col overflow-hidden border border-gray-300 rounded-lg">
               {/* Table Header */}
               <div className="grid grid-cols-5 gap-2 font-bold bg-gray-200 p-3 text-center border-b border-gray-300">
                 <div>Kelas</div>
                 <div>Mata Kuliah</div>
                 <div>Jam</div>
                 <div>Ruang</div>
                 <div>Status</div>
               </div>
               
               {/* Table Body (Auto-scrolling) */}
               <div ref={scrollRef} className="flex-1 overflow-y-hidden">
                  <div className="flex flex-col">
                    {pelaksanaan.map((item, idx) => {
                       let statusText = "Belum dikonfirmasi";
                       let statusColor = "text-gray-500";
                       switch(Number(item.status)) {
                         case 1: statusText = "Offline"; statusColor = "text-green-600"; break;
                         case 2: statusText = "Online"; statusColor = "text-blue-600"; break;
                         case 3: statusText = "Pindah"; statusColor = "text-yellow-600"; break;
                         case 4: statusText = "Kosong"; statusColor = "text-red-600"; break;
                         case 5: statusText = "Dibatalkan"; statusColor = "text-gray-800"; break;
                       }

                       return (
                         <div key={item.id} className="grid grid-cols-5 gap-2 border-b p-3 text-center items-center">
                           <div className="font-semibold">{item.namaKelas}</div>
                           <div className="text-sm">{item.mataKuliah}</div>
                           <div>{item.jamMulai?.slice(0, 5)} - {item.jamSelesai?.slice(0, 5)}</div>
                           <div>{item.ruang || "-"}</div>
                           <div className={`font-semibold ${statusColor}`}>{statusText}</div>
                         </div>
                       )
                    })}
                  </div>
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