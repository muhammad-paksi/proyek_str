CREATE TABLE "agenda" (
	"id_agenda" bigserial NOT NULL,
	"nama" varchar(100) NOT NULL,
	"deskripsi" varchar(500),
	"waktu_mulai" timestamp NOT NULL,
	CONSTRAINT "agenda_id_agenda" PRIMARY KEY("id_agenda")
);
--> statement-breakpoint
CREATE TABLE "dosen" (
	"kode_dosen" varchar(8) NOT NULL,
	"nama_dosen" varchar(75) NOT NULL,
	CONSTRAINT "dosen_kode_dosen" PRIMARY KEY("kode_dosen")
);
--> statement-breakpoint
CREATE TABLE "hari" (
	"kode_hari" smallint NOT NULL,
	"nama_hari" varchar(12) NOT NULL,
	CONSTRAINT "hari_kode_hari" PRIMARY KEY("kode_hari")
);
--> statement-breakpoint
CREATE TABLE "jadwal" (
	"id_jadwal" bigserial NOT NULL,
	"kode_kelas" varchar(8) NOT NULL,
	"kode_ruang" varchar(8),
	"kode_mk" varchar(20) NOT NULL,
	"kode_dosen" varchar(8),
	"kode_hari" smallint,
	"jp_mulai" varchar(8),
	"jp_selesai" varchar(8),
	"keterangan" varchar(250),
	CONSTRAINT "jadwal_id_jadwal" PRIMARY KEY("id_jadwal")
);
--> statement-breakpoint
CREATE TABLE "jam_pelajaran" (
	"kode_jp" varchar(8) NOT NULL,
	"jam_mulai" time NOT NULL,
	"jam_selesai" time NOT NULL,
	CONSTRAINT "jam_pelajaran_kode_jp" PRIMARY KEY("kode_jp"),
	CONSTRAINT "kode_jp_unique" UNIQUE("kode_jp")
);
--> statement-breakpoint
CREATE TABLE "kelas" (
	"kode_kelas" varchar(8) NOT NULL,
	"nama_kelas" varchar(50) NOT NULL,
	"kode_prodi" varchar(8) NOT NULL,
	CONSTRAINT "kelas_kode_kelas" PRIMARY KEY("kode_kelas")
);
--> statement-breakpoint
CREATE TABLE "mata_kuliah" (
	"kode_mk" varchar(20) NOT NULL,
	"nama_mk" varchar(50) NOT NULL,
	CONSTRAINT "mata_kuliah_kode_mk" PRIMARY KEY("kode_mk")
);
--> statement-breakpoint
CREATE TABLE "prodi" (
	"kode_prodi" varchar(8) NOT NULL,
	"nama_prodi" varchar(50) NOT NULL,
	CONSTRAINT "prodi_kode_prodi" PRIMARY KEY("kode_prodi")
);
--> statement-breakpoint
CREATE TABLE "ruang" (
	"kode_ruang" varchar(8) NOT NULL,
	"nama_ruang" varchar(50) NOT NULL,
	"kapasitas" smallint NOT NULL,
	CONSTRAINT "ruang_kode_ruang" PRIMARY KEY("kode_ruang")
);
--> statement-breakpoint
ALTER TABLE "jadwal" ADD CONSTRAINT "jadwal_kode_kelas_kelas_kode_kelas_fk" FOREIGN KEY ("kode_kelas") REFERENCES "public"."kelas"("kode_kelas") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "jadwal" ADD CONSTRAINT "jadwal_kode_ruang_ruang_kode_ruang_fk" FOREIGN KEY ("kode_ruang") REFERENCES "public"."ruang"("kode_ruang") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "jadwal" ADD CONSTRAINT "jadwal_kode_mk_mata_kuliah_kode_mk_fk" FOREIGN KEY ("kode_mk") REFERENCES "public"."mata_kuliah"("kode_mk") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "jadwal" ADD CONSTRAINT "jadwal_kode_dosen_dosen_kode_dosen_fk" FOREIGN KEY ("kode_dosen") REFERENCES "public"."dosen"("kode_dosen") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "jadwal" ADD CONSTRAINT "jadwal_kode_hari_hari_kode_hari_fk" FOREIGN KEY ("kode_hari") REFERENCES "public"."hari"("kode_hari") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "jadwal" ADD CONSTRAINT "jadwal_jp_mulai_jam_pelajaran_kode_jp_fk" FOREIGN KEY ("jp_mulai") REFERENCES "public"."jam_pelajaran"("kode_jp") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "jadwal" ADD CONSTRAINT "jadwal_jp_selesai_jam_pelajaran_kode_jp_fk" FOREIGN KEY ("jp_selesai") REFERENCES "public"."jam_pelajaran"("kode_jp") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "kelas" ADD CONSTRAINT "kelas_kode_prodi_prodi_kode_prodi_fk" FOREIGN KEY ("kode_prodi") REFERENCES "public"."prodi"("kode_prodi") ON DELETE restrict ON UPDATE cascade;