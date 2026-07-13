ALTER TABLE "jadwal" DROP CONSTRAINT "jadwal_jp_mulai_jam_pelajaran_kode_jp_fk";
--> statement-breakpoint
ALTER TABLE "jadwal" DROP CONSTRAINT "jadwal_jp_selesai_jam_pelajaran_kode_jp_fk";
--> statement-breakpoint
ALTER TABLE "jadwal" ADD COLUMN "kode_jp" varchar(8);--> statement-breakpoint
ALTER TABLE "jadwal" ADD CONSTRAINT "jadwal_kode_jp_jam_pelajaran_kode_jp_fk" FOREIGN KEY ("kode_jp") REFERENCES "public"."jam_pelajaran"("kode_jp") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "jadwal" DROP COLUMN "jp_mulai";--> statement-breakpoint
ALTER TABLE "jadwal" DROP COLUMN "jp_selesai";