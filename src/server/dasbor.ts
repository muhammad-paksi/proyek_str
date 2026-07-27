"use server";

import * as v from "valibot";
import { eq, asc } from "drizzle-orm";
import { db } from "@/database/conn";
import { dasbor_agenda } from "@/database/schemas/jadwal.schema";
import { actionClient } from "@/server/safe-action";

const getDasborSchema = v.object({
  lantai: v.number(),
});

export const getDasborAgendaList = actionClient
  .inputSchema(getDasborSchema)
  .action(async ({ parsedInput }) => {
    const rows = await db
      .select({
        id_agenda: dasbor_agenda.id_agenda,
      })
      .from(dasbor_agenda)
      .where(eq(dasbor_agenda.lantai, parsedInput.lantai))
      .orderBy(asc(dasbor_agenda.urutan));

    return rows.map(r => r.id_agenda);
  });

const saveDasborSchema = v.object({
  lantai: v.number(),
  agendaIds: v.array(v.number()),
});

export const saveDasborAgenda = actionClient
  .inputSchema(saveDasborSchema)
  .action(async ({ parsedInput }) => {
    await db.transaction(async (tx) => {
      // 1. Hapus entri lama menggunakan `tx` (bukan `db`)
      await tx
        .delete(dasbor_agenda)
        .where(eq(dasbor_agenda.lantai, parsedInput.lantai));

      // 2. Tambah entri baru menggunakan `tx`
      if (parsedInput.agendaIds.length > 0) {
        const values = parsedInput.agendaIds.map((id, index) => ({
          id_agenda: id,
          lantai: parsedInput.lantai,
          urutan: index + 1,
        }));
        console.log("values", values)
        
        await tx.insert(dasbor_agenda).values(values);
      }
    });

    return { success: true };
  });
