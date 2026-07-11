ALTER TABLE "user" RENAME COLUMN "id_user" TO "id";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_id_user";
--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_id_user" PRIMARY KEY("id");