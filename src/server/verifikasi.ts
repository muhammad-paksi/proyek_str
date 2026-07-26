"use server";

import * as v from "valibot";
import { eq, and } from "drizzle-orm";
import { db } from "@/database/conn";
import { 
  pelaksanaan, jadwal, mataKuliah, ruang, jamPelajaran 
} from "@/database/schemas/jadwal.schema";
import { actionClient } from "@/server/safe-action";

const getPelaksanaanSchema = v.object({
  date: v.string(), // ISO string YYYY-MM-DD
  kodeKelas: v.nullable(v.string()), // null means all classes
});

export const getPelaksanaanList = actionClient
  .inputSchema(getPelaksanaanSchema)
  .action(async ({ parsedInput }) => {
    const queryDate = new Date(parsedInput.date);

    const query = db
      .select({
        id: pelaksanaan.id,
        mata_kuliah: mataKuliah.namaMk,
        jam_mulai: jamPelajaran.jamMulai,
        jam_selesai: jamPelajaran.jamSelesai,
        ruang: ruang.namaRuang,
        status: pelaksanaan.status,
      })
      .from(pelaksanaan)
      .innerJoin(jadwal, eq(pelaksanaan.kodeJadwal, jadwal.idJadwal))
      .innerJoin(mataKuliah, eq(jadwal.kodeMk, mataKuliah.kodeMk))
      .leftJoin(ruang, eq(jadwal.kodeRuang, ruang.kodeRuang))
      .leftJoin(jamPelajaran, eq(jadwal.kodeJp, jamPelajaran.kodeJp));

    let rows;
    if (parsedInput.kodeKelas) {
      rows = await query.where(
        and(
          eq(pelaksanaan.date, queryDate),
          eq(jadwal.kodeKelas, parsedInput.kodeKelas)
        )
      );
    } else {
      rows = await query.where(eq(pelaksanaan.date, queryDate));
    }

    return rows.map(r => ({
      id: r.id,
      mata_kuliah: r.mata_kuliah,
      // Format jam pelajaran to "HH:mm-HH:mm" (cutting seconds if it returns HH:mm:ss)
      jam_pelajaran: `${r.jam_mulai?.slice(0, 5) ?? '?'} - ${r.jam_selesai?.slice(0, 5) ?? '?'}`,
      ruang: r.ruang ?? "-",
      status: Number(r.status) || 0,
    }));
  });
