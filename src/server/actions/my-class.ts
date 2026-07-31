"use server";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/database/conn";
import { user, role, jadwal, pelaksanaan, mataKuliah, jamPelajaran, ruang } from "@/database/schemas/jadwal.schema";
import { eq, and, sql } from "drizzle-orm";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super_secret_key_12345"
);

export async function getMyClassPelaksanaan(selectedDate?: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return [];

  let username: string | null = null;
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    username = (verified.payload.username as string) || null;
  } catch {
    return [];
  }

  if (!username) return [];

  // Get user's class code from user table or role table
  const dbUser = await db.select({ kodeKelas: user.kodeKelas }).from(user).where(eq(user.username, username)).limit(1);
  let userKodeKelas = dbUser.length > 0 ? dbUser[0].kodeKelas : null;

  if (!userKodeKelas) {
    const dbRole = await db.select({ kelas: role.kelas }).from(role).where(eq(role.username, username)).limit(1);
    userKodeKelas = dbRole.length > 0 ? dbRole[0].kelas : null;
  }

  if (!userKodeKelas) return [];

  // Query pelaksanaan matching student's class
  const targetDate = selectedDate || new Date().toISOString().split("T")[0];
  const conditions = [
    eq(jadwal.kodeKelas, userKodeKelas),
    sql`${pelaksanaan.date}::text = ${targetDate}`,
  ];

  const results = await db
    .select({
      id: pelaksanaan.id,
      status: pelaksanaan.status,
      date: pelaksanaan.date,
      mata_kuliah: mataKuliah.namaMk,
      jamMulai: jamPelajaran.jamMulai,
      jamSelesai: jamPelajaran.jamSelesai,
      ruang: ruang.namaRuang,
      kodeKelas: jadwal.kodeKelas,
    })
    .from(pelaksanaan)
    .innerJoin(jadwal, eq(pelaksanaan.kodeJadwal, jadwal.idJadwal))
    .leftJoin(mataKuliah, eq(jadwal.kodeMk, mataKuliah.kodeMk))
    .leftJoin(jamPelajaran, eq(jadwal.kodeJp, jamPelajaran.kodeJp))
    .leftJoin(ruang, eq(jadwal.kodeRuang, ruang.kodeRuang))
    .where(and(...conditions));

  return results.map((item) => ({
    id: item.id,
    mata_kuliah: item.mata_kuliah || "Tidak diketahui",
    jam_pelajaran: item.jamMulai && item.jamSelesai ? `${item.jamMulai} - ${item.jamSelesai}` : "-",
    ruang: item.ruang || "-",
    status: item.status || 0,
    date: item.date,
  }));
}

export async function getPelaksanaanDetail(idPelaksanaan: number) {
  const results = await db
    .select({
      id: pelaksanaan.id,
      kodeRuang: pelaksanaan.ruang,
      status: pelaksanaan.status,
      mata_kuliah: mataKuliah.namaMk,
      jamMulai: jamPelajaran.jamMulai,
      jamSelesai: jamPelajaran.jamSelesai,
      date: pelaksanaan.date,
    })
    .from(pelaksanaan)
    .innerJoin(jadwal, eq(pelaksanaan.kodeJadwal, jadwal.idJadwal))
    .leftJoin(mataKuliah, eq(jadwal.kodeMk, mataKuliah.kodeMk))
    .leftJoin(jamPelajaran, eq(jadwal.kodeJp, jamPelajaran.kodeJp))
    .where(eq(pelaksanaan.id, idPelaksanaan))
    .limit(1);

  if (results.length === 0) return null;
  const item = results[0];
  return {
    id: item.id,
    kodeRuang: item.kodeRuang ?? null,
    status: Number(item.status) || 0,
    mata_kuliah: item.mata_kuliah || "Tidak diketahui",
    jam_pelajaran: item.jamMulai && item.jamSelesai
      ? `${item.jamMulai.slice(0, 5)} - ${item.jamSelesai.slice(0, 5)}`
      : "-",
    date: item.date,
  };
}

export async function getRuangList() {
  const results = await db
    .select({
      kodeRuang: ruang.kodeRuang,
      namaRuang: ruang.namaRuang,
    })
    .from(ruang);

  return results.map((r) => ({
    value: r.kodeRuang,
    label: r.kodeRuang.replace(/_/g, " "),
  }));
}

export async function updatePelaksanaan({
  id: idPelaksanaan,
  kodeRuang,
  status,
}: {
  id: number;
  kodeRuang?: string | null;
  status?: number | null;
}) {
  const updates: Record<string, unknown> = {};
  if (kodeRuang !== undefined && kodeRuang !== null) updates.ruang = kodeRuang;
  if (status !== undefined && status !== null) updates.status = status;

  if (Object.keys(updates).length === 0) return;

  await db
    .update(pelaksanaan)
    .set(updates)
    .where(eq(pelaksanaan.id, idPelaksanaan));
}
