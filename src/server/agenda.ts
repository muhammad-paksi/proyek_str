"use server";

import * as v from "valibot";
import { eq, sql, count, desc } from "drizzle-orm";
import { db } from "@/database/conn";
import { agenda, fileAgenda } from "@/database/schemas/jadwal.schema";
import { uploadToR2, deleteFromR2, getKeyFromUrl } from "@/lib/r2";
import { actionClient } from "@/server/safe-action";

// ─── List all agendas ────────────────────────────────────────────────
export const getAgendaList = actionClient
  .action(async () => {
    const rows = await db
      .select({
        id: agenda.id,
        nama: agenda.nama,
        deskripsi: agenda.deskripsi,
        waktu: agenda.waktu,
        fileCount: count(fileAgenda.id),
      })
      .from(agenda)
      .leftJoin(fileAgenda, eq(agenda.id, fileAgenda.idAgenda))
      .groupBy(agenda.id, agenda.nama, agenda.deskripsi, agenda.waktu, agenda.updated_at)
      .orderBy(desc(agenda.waktu), desc(agenda.updated_at));

    return rows;
  });

// ─── Get single agenda detail ────────────────────────────────────────
const detailSchema = v.object({
  id: v.number(),
});

export const getAgendaDetail = actionClient
  .inputSchema(detailSchema)
  .action(async ({ parsedInput }) => {
    const [row] = await db
      .select()
      .from(agenda)
      .where(eq(agenda.id, parsedInput.id))
      .limit(1);

    if (!row) return null;

    const files = await db
      .select({ id: fileAgenda.id, url: fileAgenda.url })
      .from(fileAgenda)
      .where(eq(fileAgenda.idAgenda, row.id));

    return {
      ...row,
      imageList: files,
    };
  });

// ─── Create agenda ──────────────────────────────────────────────────
const createSchema = v.object({
  nama: v.pipe(v.string(), v.minLength(1, "Nama wajib diisi")),
  waktu: v.string(), // ISO date string "YYYY-MM-DD"
  deskripsi: v.optional(v.string()),
});

export const createAgenda = actionClient
  .inputSchema(createSchema)
  .action(async ({ parsedInput }) => {
    const [inserted] = await db
      .insert(agenda)
      .values({
        nama: parsedInput.nama,
        waktu: new Date(parsedInput.waktu),
        deskripsi: parsedInput.deskripsi || null,
      })
      .returning({ id: agenda.id });

    return { id: inserted.id };
  });

// ─── Upload files for an agenda ─────────────────────────────────────
// Separate action because FormData with files can't go through valibot schema
export async function uploadAgendaFiles(formData: FormData): Promise<{ urls: string[] }> {
  const agendaId = Number(formData.get("agendaId"));
  if (!agendaId) throw new Error("agendaId is required");

  const files = formData.getAll("files") as File[];
  const urls: string[] = [];

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop() || "jpg";
    const key = `agenda/${agendaId}/${crypto.randomUUID()}.${ext}`;
    const url = await uploadToR2(buffer, key, file.type);

    await db.insert(fileAgenda).values({
      idAgenda: agendaId,
      url,
    });

    urls.push(url);
  }

  // Dummy update to trigger updated_at
  await db.update(agenda).set({ id: agendaId }).where(eq(agenda.id, agendaId));

  return { urls };
}

// ─── Update agenda ──────────────────────────────────────────────────
const updateSchema = v.object({
  id: v.number(),
  nama: v.optional(v.string()),
  waktu: v.optional(v.string()),
  deskripsi: v.optional(v.string()),
  deletedFileIds: v.optional(v.array(v.number())),
});

export const updateAgenda = actionClient
  .inputSchema(updateSchema)
  .action(async ({ parsedInput }) => {
    // Update agenda fields
    const updates: Record<string, any> = {};
    if (parsedInput.nama !== undefined) updates.nama = parsedInput.nama;
    if (parsedInput.waktu !== undefined) updates.waktu = new Date(parsedInput.waktu);
    if (parsedInput.deskripsi !== undefined) updates.deskripsi = parsedInput.deskripsi || null;

    if (Object.keys(updates).length > 0) {
      await db
        .update(agenda)
        .set(updates)
        .where(eq(agenda.id, parsedInput.id));
    }

    // Delete removed files
    if (parsedInput.deletedFileIds && parsedInput.deletedFileIds.length > 0) {
      for (const fileId of parsedInput.deletedFileIds) {
        const [file] = await db
          .select({ url: fileAgenda.url })
          .from(fileAgenda)
          .where(eq(fileAgenda.id, fileId))
          .limit(1);

        if (file) {
          await deleteFromR2(getKeyFromUrl(file.url));
          await db.delete(fileAgenda).where(eq(fileAgenda.id, fileId));
        }
      }
    }

    return { success: true };
  });

// ─── Delete agenda ──────────────────────────────────────────────────
const deleteSchema = v.object({
  id: v.number(),
});

export const deleteAgenda = actionClient
  .inputSchema(deleteSchema)
  .action(async ({ parsedInput }) => {
    // Delete files from R2 first
    const files = await db
      .select({ url: fileAgenda.url })
      .from(fileAgenda)
      .where(eq(fileAgenda.idAgenda, parsedInput.id));

    for (const file of files) {
      await deleteFromR2(getKeyFromUrl(file.url));
    }

    // Delete agenda (cascade deletes file_agenda rows)
    await db.delete(agenda).where(eq(agenda.id, parsedInput.id));

    return { success: true };
  });
