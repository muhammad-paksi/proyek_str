"use server";

import * as v from "valibot";
import { eq } from "drizzle-orm";
import { db } from "@/database/conn";
import { user, role, kelas } from "@/database/schemas/jadwal.schema";
import { actionClient } from "@/server/safe-action";

// ─── List all kelas ───────────────────────────────────────────────────
export const getKelasList = actionClient
  .action(async () => {
    const rows = await db
      .select({
        kodeKelas: kelas.kodeKelas,
        namaKelas: kelas.namaKelas,
      })
      .from(kelas);
    
    return rows.map(r => ({
      value: r.kodeKelas,
      label: r.kodeKelas.replace(/_/g, " "),
    }));
  });

// ─── List all users ───────────────────────────────────────────────────
export const getUserList = actionClient
  .action(async () => {
    const rows = await db
      .select({
        id: user.idUser,
        username: user.username,
        nama: user.nama,
        status: user.status,
        role: role.role,
      })
      .from(user)
      .leftJoin(role, eq(user.username, role.username))
      .orderBy(user.createdAt);

    return rows.map(r => ({
      ...r,
      role: r.role ?? "tidak ada",
      status: r.status ? "active" : "inactive",
    }));
  });

// ─── Get single user detail ───────────────────────────────────────────
const detailSchema = v.object({
  idUser: v.number(),
});

export const getUserDetail = actionClient
  .inputSchema(detailSchema)
  .action(async ({ parsedInput }) => {
    const [row] = await db
      .select({
        id: user.idUser,
        username: user.username,
        nama: user.nama,
        status: user.status,
        password: user.password,
        role: role.role,
        kelas: role.kelas,
      })
      .from(user)
      .leftJoin(role, eq(user.username, role.username))
      .where(eq(user.idUser, parsedInput.idUser))
      .limit(1);

    if (!row) return null;

    return {
      ...row,
      role: row.role ?? "mahasiswa",
      kelas: row.kelas,
      status: row.status ? "active" : "inactive",
    };
  });

// ─── Create user ──────────────────────────────────────────────────────
const createSchema = v.object({
  nama: v.pipe(v.string(), v.minLength(1, "Nama wajib diisi")),
  username: v.pipe(v.string(), v.minLength(1, "Username wajib diisi")),
  password: v.pipe(v.string(), v.minLength(1, "Password wajib diisi")),
  role: v.string(),
  kelas: v.optional(v.nullable(v.string())),
  status: v.boolean(),
});

export const createUser = actionClient
  .inputSchema(createSchema)
  .action(async ({ parsedInput }) => {
    // Cek apakah username sudah ada
    const existing = await db
      .select()
      .from(user)
      .where(eq(user.username, parsedInput.username))
      .limit(1);

    if (existing.length > 0) {
      throw new Error("Username sudah digunakan");
    }

    const [inserted] = await db
      .insert(user)
      .values({
        nama: parsedInput.nama,
        username: parsedInput.username,
        password: parsedInput.password,
        status: parsedInput.status,
        role: 0, // Default numeric role (as defined in schema)
        kodeKelas: (parsedInput.role === "mahasiswa" && parsedInput.kelas) ? parsedInput.kelas : null,
      })
      .returning({ idUser: user.idUser });

    // Masukkan ke tabel role
    await db.insert(role).values({
      username: parsedInput.username,
      role: parsedInput.role,
      kelas: (parsedInput.role === "mahasiswa" && parsedInput.kelas) ? parsedInput.kelas : null,
    });

    return { id: inserted.idUser };
  });

// ─── Update user ──────────────────────────────────────────────────────
const updateSchema = v.object({
  idUser: v.number(),
  oldUsername: v.string(),
  nama: v.optional(v.string()),
  username: v.optional(v.string()),
  password: v.optional(v.string()),
  role: v.optional(v.string()),
  kelas: v.optional(v.nullable(v.string())),
  status: v.optional(v.boolean()),
});

export const updateUser = actionClient
  .inputSchema(updateSchema)
  .action(async ({ parsedInput }) => {
    // Update user
    const updates: Record<string, any> = {};
    if (parsedInput.nama !== undefined) updates.nama = parsedInput.nama;
    if (parsedInput.password !== undefined) updates.password = parsedInput.password;
    if (parsedInput.status !== undefined) updates.status = parsedInput.status;
    if (parsedInput.username !== undefined) updates.username = parsedInput.username;
    if (parsedInput.role !== undefined || parsedInput.kelas !== undefined) {
      if (parsedInput.role !== "mahasiswa") {
        updates.kodeKelas = null;
      } else if (parsedInput.kelas !== undefined) {
        updates.kodeKelas = parsedInput.kelas;
      }
    }

    if (Object.keys(updates).length > 0) {
      // Jika ubah username, kita perlu cek apakah bentrok
      if (parsedInput.username && parsedInput.username !== parsedInput.oldUsername) {
        const existing = await db
          .select()
          .from(user)
          .where(eq(user.username, parsedInput.username))
          .limit(1);

        if (existing.length > 0) {
          throw new Error("Username sudah digunakan");
        }
      }

      await db
        .update(user)
        .set(updates)
        .where(eq(user.idUser, parsedInput.idUser));
    }

    // Update role
    if (parsedInput.role !== undefined || parsedInput.kelas !== undefined || (parsedInput.username && parsedInput.username !== parsedInput.oldUsername)) {
      const newUsername = parsedInput.username ?? parsedInput.oldUsername;
      
      const existingRole = await db
        .select()
        .from(role)
        .where(eq(role.username, parsedInput.oldUsername))
        .limit(1);

      if (existingRole.length > 0) {
        const newRole = parsedInput.role !== undefined ? parsedInput.role : existingRole[0].role;
        const newKelas = newRole === "mahasiswa" 
          ? (parsedInput.kelas !== undefined ? parsedInput.kelas : existingRole[0].kelas)
          : null;

        await db
          .update(role)
          .set({ 
            role: newRole,
            kelas: newKelas,
            username: newUsername
          })
          .where(eq(role.username, parsedInput.oldUsername));
      } else {
        await db.insert(role).values({
          username: newUsername,
          role: parsedInput.role ?? "mahasiswa",
          kelas: parsedInput.role === "mahasiswa" ? (parsedInput.kelas ?? null) : null,
        });
      }
    }

    return { success: true };
  });

// ─── Delete user ──────────────────────────────────────────────────────
const deleteSchema = v.object({
  idUser: v.number(),
  username: v.string(),
});

export const deleteUser = actionClient
  .inputSchema(deleteSchema)
  .action(async ({ parsedInput }) => {
    // Hapus dari tabel role (karena menggunakan relasi username)
    await db.delete(role).where(eq(role.username, parsedInput.username));

    // Hapus dari tabel user
    await db.delete(user).where(eq(user.idUser, parsedInput.idUser));

    return { success: true };
  });
