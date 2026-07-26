CREATE TABLE "file_agenda" (
	"id" bigserial NOT NULL,
	"id_agenda" bigserial NOT NULL,
	"url" text NOT NULL,
	CONSTRAINT "file_agenda_id_file_agenda" PRIMARY KEY("id")
);
--> statement-breakpoint
ALTER TABLE "pelaksanaan" ADD COLUMN "status" numeric DEFAULT 0;--> statement-breakpoint
ALTER TABLE "file_agenda" ADD CONSTRAINT "file_agenda_id_agenda_agenda_id_fk" FOREIGN KEY ("id_agenda") REFERENCES "public"."agenda"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "agenda" DROP COLUMN "image_url";