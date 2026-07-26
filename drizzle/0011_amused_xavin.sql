CREATE TABLE "dasbor_agenda" (
	"id" bigserial NOT NULL,
	"nama" varchar(100),
	"deskripsi" varchar(500),
	"lantai" numeric NOT NULL,
	"urutan" numeric NOT NULL,
	CONSTRAINT "dasbor_id_agenda" PRIMARY KEY ("id")
);
--> statement-breakpoint
ALTER TABLE "agenda" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "agenda" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "dasbor_agenda" ADD CONSTRAINT "dasbor_agenda_id_agenda_id_fk" FOREIGN KEY ("id") REFERENCES "public"."agenda"("id") ON DELETE cascade ON UPDATE cascade;