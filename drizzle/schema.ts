import { pgTable, foreignKey, varchar, smallint, time, index, bigserial, timestamp, unique, numeric, boolean, date, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const kelas = pgTable("kelas", {
	kodeKelas: varchar("kode_kelas", { length: 8 }).primaryKey().notNull(),
	namaKelas: varchar("nama_kelas", { length: 50 }).notNull(),
	kodeProdi: varchar("kode_prodi", { length: 8 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.kodeProdi],
			foreignColumns: [prodi.kodeProdi],
			name: "kelas_kode_prodi_prodi_kode_prodi_fk"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const ruang = pgTable("ruang", {
	kodeRuang: varchar("kode_ruang", { length: 8 }).primaryKey().notNull(),
	namaRuang: varchar("nama_ruang", { length: 50 }).notNull(),
	kapasitas: smallint().notNull(),
});

export const mataKuliah = pgTable("mata_kuliah", {
	kodeMk: varchar("kode_mk", { length: 20 }).primaryKey().notNull(),
	namaMk: varchar("nama_mk", { length: 50 }).notNull(),
});

export const dosen = pgTable("dosen", {
	kodeDosen: varchar("kode_dosen", { length: 8 }).primaryKey().notNull(),
	namaDosen: varchar("nama_dosen", { length: 75 }).notNull(),
});

export const hari = pgTable("hari", {
	kodeHari: smallint("kode_hari").primaryKey().notNull(),
	namaHari: varchar("nama_hari", { length: 12 }).notNull(),
});

export const jamPelajaran = pgTable("jam_pelajaran", {
	kodeJp: varchar("kode_jp", { length: 8 }).primaryKey().notNull(),
	jamMulai: time("jam_mulai").notNull(),
	jamSelesai: time("jam_selesai").notNull(),
});

export const prodi = pgTable("prodi", {
	kodeProdi: varchar("kode_prodi", { length: 8 }).primaryKey().notNull(),
	namaProdi: varchar("nama_prodi", { length: 50 }).notNull(),
});

export const jadwal = pgTable("jadwal", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	kodeKelas: varchar("kode_kelas", { length: 8 }).notNull(),
	kodeRuang: varchar("kode_ruang", { length: 8 }),
	kodeMk: varchar("kode_mk", { length: 20 }).notNull(),
	kodeDosen: varchar("kode_dosen", { length: 8 }),
	kodeHari: smallint("kode_hari"),
	keterangan: varchar({ length: 250 }),
	kodeJp: varchar("kode_jp", { length: 8 }),
}, (table) => [
	index("idx_hari").using("btree", table.kodeHari.asc().nullsLast().op("int2_ops")),
	index("idx_hari_kelas").using("btree", table.kodeKelas.asc().nullsLast().op("int2_ops"), table.kodeHari.asc().nullsLast().op("int2_ops")),
	foreignKey({
			columns: [table.kodeKelas],
			foreignColumns: [kelas.kodeKelas],
			name: "jadwal_kode_kelas_kelas_kode_kelas_fk"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.kodeRuang],
			foreignColumns: [ruang.kodeRuang],
			name: "jadwal_kode_ruang_ruang_kode_ruang_fk"
		}).onUpdate("cascade").onDelete("set null"),
	foreignKey({
			columns: [table.kodeMk],
			foreignColumns: [mataKuliah.kodeMk],
			name: "jadwal_kode_mk_mata_kuliah_kode_mk_fk"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.kodeDosen],
			foreignColumns: [dosen.kodeDosen],
			name: "jadwal_kode_dosen_dosen_kode_dosen_fk"
		}).onUpdate("cascade").onDelete("set null"),
	foreignKey({
			columns: [table.kodeHari],
			foreignColumns: [hari.kodeHari],
			name: "jadwal_kode_hari_hari_kode_hari_fk"
		}).onUpdate("cascade").onDelete("set null"),
	foreignKey({
			columns: [table.kodeJp],
			foreignColumns: [jamPelajaran.kodeJp],
			name: "jadwal_kode_jp_jam_pelajaran_kode_jp_fk"
		}).onUpdate("cascade").onDelete("set null"),
]);

export const agenda = pgTable("agenda", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	nama: varchar({ length: 100 }),
	deskripsi: varchar({ length: 500 }),
	waktu: timestamp({ mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const user = pgTable("user", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	nama: varchar({ length: 100 }).notNull(),
	username: varchar({ length: 75 }).notNull(),
	password: varchar({ length: 75 }).notNull(),
	role: numeric(),
	kodeKelas: varchar("kode_kelas", { length: 8 }),
	status: boolean().default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.kodeKelas],
			foreignColumns: [kelas.kodeKelas],
			name: "user_kode_kelas_kelas_kode_kelas_fk"
		}).onUpdate("cascade").onDelete("set null"),
	unique("user_username_unique").on(table.username),
]);

export const perwakilan = pgTable("perwakilan", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	idUser: varchar("id_user", { length: 50 }).notNull(),
	kodeKelas: varchar("kode_kelas", { length: 8 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.kodeKelas],
			foreignColumns: [kelas.kodeKelas],
			name: "perwakilan_kode_kelas_kelas_kode_kelas_fk"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const role = pgTable("role", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	username: varchar({ length: 75 }).notNull(),
	role: varchar({ length: 50 }).notNull(),
	namaHari: varchar("nama_hari", { length: 20 }),
});

export const pelaksanaan = pgTable("pelaksanaan", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	kodeJadwal: bigserial("kode_jadwal", { mode: "bigint" }).notNull(),
	date: date().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	status: numeric().default('0'),
}, (table) => [
	index("idx_tanggal_jadwal").using("btree", table.date.asc().nullsLast().op("date_ops"), table.kodeJadwal.asc().nullsLast().op("date_ops")),
	foreignKey({
			columns: [table.kodeJadwal],
			foreignColumns: [jadwal.id],
			name: "pelaksanaan_kode_jadwal_jadwal_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const dasborAgenda = pgTable("dasbor_agenda", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	nama: varchar({ length: 100 }),
	deskripsi: varchar({ length: 500 }),
	lantai: numeric().notNull(),
	urutan: numeric().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.id],
			foreignColumns: [agenda.id],
			name: "dasbor_agenda_id_agenda_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const fileAgenda = pgTable("file_agenda", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	idAgenda: bigserial("id_agenda", { mode: "bigint" }).notNull(),
	url: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.idAgenda],
			foreignColumns: [agenda.id],
			name: "file_agenda_id_agenda_agenda_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
]);
