ALTER TABLE "dasbor_agenda" DROP CONSTRAINT "dasbor_id_agenda";--> statement-breakpoint
ALTER TABLE "dasbor_agenda" ADD CONSTRAINT "dasbor_id_agenda" PRIMARY KEY("id");