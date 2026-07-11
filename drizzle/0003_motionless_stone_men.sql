ALTER TABLE "agenda" RENAME COLUMN "id_agenda" TO "id";--> statement-breakpoint
ALTER TABLE "agenda" DROP CONSTRAINT "agenda_id_agenda";
--> statement-breakpoint
ALTER TABLE "agenda" ADD CONSTRAINT "agenda_id_agenda" PRIMARY KEY("id");