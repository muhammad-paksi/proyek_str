CREATE TABLE "user" (
	"id_user" bigserial NOT NULL,
	"nama" varchar(100) NOT NULL,
	"username" varchar(75) NOT NULL,
	"password" varchar(75) NOT NULL,
	"role" varchar(20) NOT NULL,
	"kode_kelas" varchar(8),
	CONSTRAINT "user_id_user" PRIMARY KEY("id_user"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_kode_kelas_kelas_kode_kelas_fk" FOREIGN KEY ("kode_kelas") REFERENCES "public"."kelas"("kode_kelas") ON DELETE set null ON UPDATE cascade;