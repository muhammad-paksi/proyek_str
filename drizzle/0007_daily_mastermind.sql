ALTER TABLE "agenda" ALTER COLUMN "nama" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "agenda" ADD COLUMN "image_url" text;