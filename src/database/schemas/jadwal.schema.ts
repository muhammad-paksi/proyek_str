import {
  pgTable,
  AnyPgColumn,
  primaryKey,
  bigserial,
  date,
  index,
  numeric,
  varchar,
  timestamp,
  smallint,
  foreignKey,
  unique,
  time,
  text,
  boolean,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const user = pgTable(
  "user",
  {
    idUser: bigserial("id", { mode: "number" }).notNull(),
    nama: varchar({ length: 100 }).notNull(),
    username: varchar({ length: 75 }).notNull(),
    password: varchar({ length: 75 }).notNull(),
    role: numeric(
      "role", 
      { mode: "number" }
    ).default(0),
    status: boolean("status").default(true),
    // Kolom relasi dibuat NULLABLE (tanpa .notNull())
    kodeKelas: varchar("kode_kelas", { length: 8 }).references(
      () => kelas.kodeKelas,
      {
        onDelete: "set null", // Jika kelas dihapus, user tidak ikut terhapus
        onUpdate: "cascade",
      }
    ),
    createdAt: timestamp("created_at", { mode: "date" }).default(sql`now()`),
    updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdateFn(() => sql`now()`),
  },
  (table) => [
    primaryKey({ columns: [table.idUser], name: "user_id_user" }),
    unique("user_username_unique").on(table.username),
  ],
);
export const perwakilan = pgTable("perwakilan",{
  id: bigserial("id", { mode: "number" }).notNull(),
  idUser: varchar("id_user", { length: 50 }).notNull(),
  kelas: varchar("kode_kelas", { length: 8 })
    .notNull()
    .references(() => kelas.kodeKelas, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  createdAt: timestamp("created_at", { mode: "date" }).default(sql`now()`),
  updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdateFn(() => sql`now()`),
}, (table) => [
  primaryKey({ columns: [table.id], name: "perwakilan_id" }),
])

export const role = pgTable(
  "role",
  {
    id: bigserial("id", { mode: "number" }).notNull(),
    username: varchar({ length: 75 }).notNull(),
    role: varchar({length: 50}).notNull(),
    kelas: varchar("nama_hari", { length: 20 }),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: "role_id" }),
  ],
);

export const agenda = pgTable(
  "agenda",
  {
    idAgenda: bigserial("id", { mode: "number" }).notNull(),
    nama: varchar({ length: 100 }),
    imageURL: text("image_url"),
    deskripsi: varchar({ length: 500 }),
    waktu: date("waktu", { mode: "date" }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.idAgenda], name: "agenda_id_agenda" }),
  ],
);

export const jadwal = pgTable(
  "jadwal",
  {
    idJadwal: bigserial("id", { mode: "number" }).notNull(),
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
    kodeJp: varchar("kode_jp", {length: 8}).references(() => jamPelajaran.kodeJp, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    // jpMulai: varchar("jp_mulai", {length:8}).references(() => jamPelajaran.kodeJp, {
    //   onDelete: "set null",
    //   onUpdate: "cascade",
    // }),
    // jpSelesai: varchar("jp_selesai", {length:8}).references(() => jamPelajaran.kodeJp, {
    //   onDelete: "set null",
    //   onUpdate: "cascade",
    // }),
    keterangan: varchar({ length: 250 }),
  },
  (table) => [
    primaryKey({ columns: [table.idJadwal], name: "jadwal_id_jadwal" }),
    index("idx_hari").on(table.kodeHari),
    index("idx_hari_kelas").on(table.kodeKelas, table.kodeHari),
  ],
);

export const pelaksanaan = pgTable(
  "pelaksanaan",
  {
    id: bigserial("id", { mode: "number" }).notNull(),
    kodeJadwal: bigserial("kode_jadwal", { mode: "number" })
      .notNull()
      .references(() => jadwal.idJadwal, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    /**
     * Status pelaksanaan
     * 0 = Belum dikonfirmasi
     * 1 = Offline
     * 2 = Online
     * 3 = Pindah
     * 4 = Kosong
     * 5 = Dibatalkan
     */
    status: numeric("status", {mode: "number"}).default(0), 
    date: date("date", { mode: "date" }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).default(sql`now()`),
    updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdateFn(() => sql`now()`),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: "pelaksanaan_id" }),
    index("idx_tanggal_jadwal").on(table.date, table.kodeJadwal),
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

export const jamPelajaran = pgTable(
  "jam_pelajaran",
  {
    kodeJp: varchar("kode_jp", {length: 8}).notNull(),
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
