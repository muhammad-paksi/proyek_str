ALTER TABLE "agenda" ALTER COLUMN "deskripsi" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "agenda" ADD COLUMN "tempat" varchar(255);--> statement-breakpoint
ALTER TABLE "agenda" ADD COLUMN "lantai" integer;--> statement-breakpoint
ALTER TABLE "agenda" ADD COLUMN "waktu_mulai" time;--> statement-breakpoint
ALTER TABLE "agenda" ADD COLUMN "waktu_selesai" time;