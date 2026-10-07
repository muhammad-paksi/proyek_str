
import { db } from "@/database/conn"
import { agenda, fileAgenda } from "@/database/schemas/jadwal.schema"
import { eq, sql } from "drizzle-orm"

export async function GET() {
  try {
    const res = await db
      .select({
        tempat: agenda.tempat,
        waktuMulai: agenda.waktuMulai,
        waktuSelesai: agenda.waktuSelesai,
        tanggal: agenda.waktu,
        deskripsi: agenda.nama,
        lantai: agenda.lantai,
        linkGambar: sql<string[]>`array_agg(${fileAgenda.url}) filter (where ${fileAgenda.url} is not null)`,
      })
      .from(agenda)
      .where(sql`DATE(${agenda.waktu}) = CURRENT_DATE`)
      .leftJoin(fileAgenda, eq(agenda.id, fileAgenda.idAgenda))
      .groupBy(
        agenda.tempat,
        agenda.waktuMulai,
        agenda.waktuSelesai,
        agenda.waktu,
        agenda.nama,
        agenda.lantai,
      )
      .execute()

    return Response.json({ 
      success: true,
      message: "Fetch berhasil",
      data: res
    })
  } catch (error) {
    console.error("Error fetching agenda:", error)
    return Response.json({ 
      success: false,
      message: "Fetch gagal",
      data: null
    }, { status: 500 })
  }
}