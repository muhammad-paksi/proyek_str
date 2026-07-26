"use server";

import * as v from "valibot";
import { eq, asc } from "drizzle-orm";
import { db } from "@/database/conn";
import { 
  dasbor_agenda, agenda, fileAgenda, pelaksanaan, jadwal, kelas, mataKuliah, ruang, jamPelajaran, hari
} from "@/database/schemas/jadwal.schema";
import { actionClient } from "@/server/safe-action";
import { getUserRole } from "@/server/auth/get-role";

const getDasborDataSchema = v.object({
  lantai: v.number(),
});

export const getDasborData = actionClient
  .inputSchema(getDasborDataSchema)
  .action(async ({ parsedInput }) => {
    const role = await getUserRole();

    // 1. Get images
    const imagesQuery = await db
      .select({
        url: fileAgenda.url
      })
      .from(dasbor_agenda)
      .innerJoin(agenda, eq(dasbor_agenda.id_agenda, agenda.id))
      .innerJoin(fileAgenda, eq(agenda.id, fileAgenda.idAgenda))
      .where(eq(dasbor_agenda.lantai, parsedInput.lantai))
      .orderBy(asc(dasbor_agenda.urutan));

    const images = imagesQuery.map(row => row.url);

    // 2. Get today's classes
    const today = new Date();
    const todayStr = today.toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" }); 

    const pelaksanaanRows = await db
      .select({
        id: pelaksanaan.id,
        status: pelaksanaan.status,
        kelas: kelas.kodeKelas,
        namaKelas: kelas.namaKelas,
        mataKuliah: mataKuliah.namaMk,
        ruang: ruang.namaRuang,
        jamMulai: jamPelajaran.jamMulai,
        jamSelesai: jamPelajaran.jamSelesai,
        kodeJp: jamPelajaran.kodeJp,
      })
      .from(pelaksanaan)
      .innerJoin(jadwal, eq(pelaksanaan.kodeJadwal, jadwal.idJadwal))
      .innerJoin(kelas, eq(jadwal.kodeKelas, kelas.kodeKelas))
      .innerJoin(mataKuliah, eq(jadwal.kodeMk, mataKuliah.kodeMk))
      .leftJoin(ruang, eq(jadwal.kodeRuang, ruang.kodeRuang))
      .leftJoin(jamPelajaran, eq(jadwal.kodeJp, jamPelajaran.kodeJp))
      .where(eq(pelaksanaan.date, new Date(todayStr)))
      .orderBy(asc(kelas.kodeKelas), asc(jamPelajaran.jamMulai));

    return {
      images,
      pelaksanaan: pelaksanaanRows,
      role
    };
  });

export const mulaiKelas = actionClient
  .action(async () => {
    const role = await getUserRole();
    if (role !== "admin") {
      throw new Error("Unauthorized");
    }

    const today = new Date();
    const todayStr = today.toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
    const dayNames = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dayIndex = new Date(today.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })).getDay();
    const todayName = dayNames[dayIndex];

    const [hariRow] = await db.select().from(hari).where(eq(hari.namaHari, todayName)).limit(1);
    
    if (!hariRow) {
       return { success: false, message: "Hari tidak ditemukan di database" };
    }

    const jadwalRows = await db
      .select()
      .from(jadwal)
      .where(eq(jadwal.kodeHari, hariRow.kodeHari));

    if (jadwalRows.length === 0) {
      return { success: false, message: "Tidak ada jadwal untuk hari ini" };
    }

    const values = jadwalRows.map(j => ({
      kodeJadwal: j.idJadwal,
      date: new Date(todayStr),
      status: 0 
    }));

    await db.insert(pelaksanaan).values(values);

    return { success: true };
  });
