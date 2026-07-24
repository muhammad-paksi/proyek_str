CREATE TABLE "role" (
	"id" bigserial NOT NULL,
	"username" varchar(75) NOT NULL,
	"role" varchar(50) NOT NULL,
	"nama_hari" varchar(20),
	CONSTRAINT "role_id" PRIMARY KEY("id")
);
