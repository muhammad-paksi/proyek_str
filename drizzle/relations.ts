import { relations } from "drizzle-orm/relations";
import { prodi, kelas, jadwal, ruang, mataKuliah, dosen, hari, jamPelajaran, user, perwakilan, pelaksanaan, agenda, dasborAgenda, fileAgenda } from "./schema";

export const kelasRelations = relations(kelas, ({one, many}) => ({
	prodi: one(prodi, {
		fields: [kelas.kodeProdi],
		references: [prodi.kodeProdi]
	}),
	jadwals: many(jadwal),
	users: many(user),
	perwakilans: many(perwakilan),
}));

export const prodiRelations = relations(prodi, ({many}) => ({
	kelas: many(kelas),
}));

export const jadwalRelations = relations(jadwal, ({one, many}) => ({
	kela: one(kelas, {
		fields: [jadwal.kodeKelas],
		references: [kelas.kodeKelas]
	}),
	ruang: one(ruang, {
		fields: [jadwal.kodeRuang],
		references: [ruang.kodeRuang]
	}),
	mataKuliah: one(mataKuliah, {
		fields: [jadwal.kodeMk],
		references: [mataKuliah.kodeMk]
	}),
	dosen: one(dosen, {
		fields: [jadwal.kodeDosen],
		references: [dosen.kodeDosen]
	}),
	hari: one(hari, {
		fields: [jadwal.kodeHari],
		references: [hari.kodeHari]
	}),
	jamPelajaran: one(jamPelajaran, {
		fields: [jadwal.kodeJp],
		references: [jamPelajaran.kodeJp]
	}),
	pelaksanaans: many(pelaksanaan),
}));

export const ruangRelations = relations(ruang, ({many}) => ({
	jadwals: many(jadwal),
}));

export const mataKuliahRelations = relations(mataKuliah, ({many}) => ({
	jadwals: many(jadwal),
}));

export const dosenRelations = relations(dosen, ({many}) => ({
	jadwals: many(jadwal),
}));

export const hariRelations = relations(hari, ({many}) => ({
	jadwals: many(jadwal),
}));

export const jamPelajaranRelations = relations(jamPelajaran, ({many}) => ({
	jadwals: many(jadwal),
}));

export const userRelations = relations(user, ({one}) => ({
	kela: one(kelas, {
		fields: [user.kodeKelas],
		references: [kelas.kodeKelas]
	}),
}));

export const perwakilanRelations = relations(perwakilan, ({one}) => ({
	kela: one(kelas, {
		fields: [perwakilan.kodeKelas],
		references: [kelas.kodeKelas]
	}),
}));

export const pelaksanaanRelations = relations(pelaksanaan, ({one}) => ({
	jadwal: one(jadwal, {
		fields: [pelaksanaan.kodeJadwal],
		references: [jadwal.id]
	}),
}));

export const dasborAgendaRelations = relations(dasborAgenda, ({one}) => ({
	agenda: one(agenda, {
		fields: [dasborAgenda.id],
		references: [agenda.id]
	}),
}));

export const agendaRelations = relations(agenda, ({many}) => ({
	dasborAgenda: many(dasborAgenda),
	fileAgenda: many(fileAgenda),
}));

export const fileAgendaRelations = relations(fileAgenda, ({one}) => ({
	agenda: one(agenda, {
		fields: [fileAgenda.idAgenda],
		references: [agenda.id]
	}),
}));