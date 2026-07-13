CREATE TABLE "pelaksanaan" (
	"id" bigserial NOT NULL,
	"kode_jadwal" bigserial NOT NULL,
	"date" date NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "pelaksanaan_id" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "perwakilan" (
	"id" bigserial NOT NULL,
	"id_user" varchar(50) NOT NULL,
	"kode_kelas" varchar(8) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "perwakilan_id" PRIMARY KEY("id")
);
--> statement-breakpoint
ALTER TABLE "agenda" RENAME COLUMN "waktu_mulai" TO "waktu";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DATA TYPE numeric USING "role"::numeric;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "status" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "pelaksanaan" ADD CONSTRAINT "pelaksanaan_kode_jadwal_jadwal_id_fk" FOREIGN KEY ("kode_jadwal") REFERENCES "public"."jadwal"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "perwakilan" ADD CONSTRAINT "perwakilan_kode_kelas_kelas_kode_kelas_fk" FOREIGN KEY ("kode_kelas") REFERENCES "public"."kelas"("kode_kelas") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "idx_tanggal_jadwal" ON "pelaksanaan" USING btree ("date","kode_jadwal");--> statement-breakpoint
CREATE INDEX "idx_hari" ON "jadwal" USING btree ("kode_hari");--> statement-breakpoint
CREATE INDEX "idx_hari_kelas" ON "jadwal" USING btree ("kode_kelas","kode_hari");