ALTER TABLE "jadwal" RENAME COLUMN "id_jadwal" TO "id";--> statement-breakpoint
ALTER TABLE "jadwal" DROP CONSTRAINT "jadwal_id_jadwal";
--> statement-breakpoint
ALTER TABLE "jadwal" ADD CONSTRAINT "jadwal_id_jadwal" PRIMARY KEY("id");