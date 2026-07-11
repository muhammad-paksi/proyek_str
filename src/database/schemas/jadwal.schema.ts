
export const user = pgTable(
  "user",
  {
    idUser: bigserial("id", { mode: "number" }).notNull(),
    nama: varchar({ length: 100 }).notNull(),
    username: varchar({ length: 75 }).notNull(),
    password: varchar({ length: 75 }).notNull(),
    role: varchar({ length: 20 }).notNull(), // Isinya: 'admin' atau 'mahasiswa'
    
    // Kolom relasi dibuat NULLABLE (tanpa .notNull())
    kodeKelas: varchar("kode_kelas", { length: 8 }).references(
      () => kelas.kodeKelas,
      {
        onDelete: "set null", // Jika kelas dihapus, user tidak ikut terhapus
        onUpdate: "cascade",
      }
    ),
  },
  (table) => [
    primaryKey({ columns: [table.idUser], name: "user_id_user" }),
    unique("user_username_unique").on(table.username),
  ],
);

import {
  pgTable,
  AnyPgColumn,
  primaryKey,
  bigserial,
  varchar,
  timestamp,
  smallint,
  foreignKey,
  unique,
  time,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const agenda = pgTable(
  "agenda",
  {
    idAgenda: bigserial("id", { mode: "number" }).notNull(),
    nama: varchar({ length: 100 }).notNull(),
    deskripsi: varchar({ length: 500 }),
    waktuMulai: timestamp("waktu_mulai", { mode: "string" }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.idAgenda], name: "agenda_id_agenda" }),
  ],
);

export const dosen = pgTable(
  "dosen",
  {
    kodeDosen: varchar("kode_dosen", { length: 8 }).notNull(),
    namaDosen: varchar("nama_dosen", { length: 75 }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.kodeDosen], name: "dosen_kode_dosen" }),
  ],
);

export const hari = pgTable(
  "hari",
  {
    kodeHari: smallint("kode_hari").notNull(),
    namaHari: varchar("nama_hari", { length: 12 }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.kodeHari], name: "hari_kode_hari" }),
  ],
);

export const jadwal = pgTable(
  "jadwal",
  {
    idJadwal: bigserial("id_jadwal", { mode: "number" }).notNull(),
    kodeKelas: varchar("kode_kelas", { length: 8 })
      .notNull()
      .references(() => kelas.kodeKelas, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    kodeRuang: varchar("kode_ruang", { length: 8 }).references(
      () => ruang.kodeRuang,
      { onDelete: "set null", onUpdate: "cascade" },
    ),
    kodeMk: varchar("kode_mk", { length: 20 })
      .notNull()
      .references(() => mataKuliah.kodeMk, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    kodeDosen: varchar("kode_dosen", { length: 8 }).references(
      () => dosen.kodeDosen,
      { onDelete: "set null", onUpdate: "cascade" },
    ),
    kodeHari: smallint("kode_hari").references(() => hari.kodeHari, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    jpMulai: smallint("jp_mulai").references(() => jamPelajaran.kodeJp, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    jpSelesai: smallint("jp_selesai").references(() => jamPelajaran.kodeJp, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    keterangan: varchar({ length: 250 }),
  },
  (table) => [
    primaryKey({ columns: [table.idJadwal], name: "jadwal_id_jadwal" }),
  ],
);

export const jamPelajaran = pgTable(
  "jam_pelajaran",
  {
    kodeJp: smallint("kode_jp").notNull(),
    jamMulai: time("jam_mulai").notNull(),
    jamSelesai: time("jam_selesai").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.kodeJp], name: "jam_pelajaran_kode_jp" }),
    unique("kode_jp_unique").on(table.kodeJp),
  ],
);

export const kelas = pgTable(
  "kelas",
  {
    kodeKelas: varchar("kode_kelas", { length: 8 }).notNull(),
    namaKelas: varchar("nama_kelas", { length: 50 }).notNull(),
    kodeProdi: varchar("kode_prodi", { length: 8 })
      .notNull()
      .references(() => prodi.kodeProdi, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
  },
  (table) => [
    primaryKey({ columns: [table.kodeKelas], name: "kelas_kode_kelas" }),
  ],
);

export const mataKuliah = pgTable(
  "mata_kuliah",
  {
    kodeMk: varchar("kode_mk", { length: 20 }).notNull(),
    namaMk: varchar("nama_mk", { length: 50 }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.kodeMk], name: "mata_kuliah_kode_mk" }),
  ],
);

export const prodi = pgTable(
  "prodi",
  {
    kodeProdi: varchar("kode_prodi", { length: 8 }).notNull(),
    namaProdi: varchar("nama_prodi", { length: 50 }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.kodeProdi], name: "prodi_kode_prodi" }),
  ],
);

export const ruang = pgTable(
  "ruang",
  {
    kodeRuang: varchar("kode_ruang", { length: 8 }).notNull(),
    namaRuang: varchar("nama_ruang", { length: 50 }).notNull(),
    kapasitas: smallint().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.kodeRuang], name: "ruang_kode_ruang" }),
  ],
);
