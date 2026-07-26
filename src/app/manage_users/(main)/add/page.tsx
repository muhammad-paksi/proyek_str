"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { Select, Switch } from "antd";
import { useRipple } from 'use-ripple-hook';
import { Button, FormControl, Text, TextInput, Timeline } from '@primer/react';
import { lora, nunito, shantell_sans, suse } from "@/lib/font";
import { createUser, getKelasList } from "@/server/user";

export default function Page() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [rippleOnSubmit, eventOnSubmit] = useRipple({ color: "rgba(0, 0, 0, 0.2)" });
  const [isLoading, setIsLoading] = useState(false);

  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [roleInput, setRoleInput] = useState<string | null>(null);
  const [kelasInput, setKelasInput] = useState<string | null>(null);
  const [statusInput, setStatusInput] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: kelasList = [] } = useQuery({
    queryKey: ["kelasList"],
    queryFn: async () => {
      const res = await getKelasList();
      return res?.data ?? [];
    }
  });

  const handleSubmit = async () => {
    if (!usernameInput.trim() || !passwordInput || !roleInput) {
      setErrorMsg("Harap isi semua field wajib");
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await createUser({
        username: usernameInput.trim(),
        nama: usernameInput.trim(), // Gunakan username sebagai nama
        password: passwordInput,
        role: roleInput,
        kelas: roleInput === "mahasiswa" ? kelasInput : null,
        status: statusInput
      });
      await queryClient.invalidateQueries({ queryKey: ["manage-users"] });
      router.push("/manage_users");
    } catch (e: any) {
      console.error("Failed to create user:", e);
      setErrorMsg(e.message || "Gagal membuat pengguna");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <main className="border-r-0 border-r-red-400 w-full overflow-hidden pl-20 pb-20">
        <div className="h-fit max-w-md flex flex-col gap-4 pt-8 pb-2 px-4 border-r-0 border-r-gray-400 border-0 font-sans bg-white">
          <div>
            <h2 className={`mb-1 text-xl font-semibold ${lora.className}`}>
              Tambah pengguna
            </h2>
            <Text size="medium" weight="normal" className="block text-neutral-500">
              Tambahkan pengguna yang akan diberikan akses khusus.&#10;
            </Text>
            <Text size="small" weight="normal" className="text-neutral-500">
              <span className="text-red-500">*</span> wajib diisi
            </Text>
            {errorMsg && (
              <div className="mt-2 text-sm text-red-500 font-semibold bg-red-50 p-2 rounded border border-red-200">
                {errorMsg}
              </div>
            )}
          </div>

          <Timeline clipSidebar>
            {/* NO. 1 - Username */}
            <Timeline.Item>
              <Timeline.Badge className={`text-sm font-normal ${lora.className}`}>1</Timeline.Badge>
              <Timeline.Body>
                <FormControl aria-label="username-field" className="flex-none">
                  <FormControl.Label required requiredText="">
                    Pilih username <span className="text-red-500">*</span>
                  </FormControl.Label>
                  <TextInput 
                    className={`w-full`} 
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                  />
                  <FormControl.Caption className="">
                    Misal:&nbsp;
                    <span className="font-medium text-green-600">tim-bubadibako</span>
                  </FormControl.Caption>
                </FormControl>
              </Timeline.Body>
            </Timeline.Item>

            {/* NO. 2 - Password */}
            <Timeline.Item>
              <Timeline.Badge className={`text-sm font-normal ${lora.className}`}>2</Timeline.Badge>
              <Timeline.Body>
                <FormControl aria-label="password-field" className="flex-none">
                  <FormControl.Label required requiredText="">
                    Password <span className="text-red-500">*</span>
                  </FormControl.Label>
                  <TextInput 
                    type="password"
                    className={`w-full`} 
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                  />
                </FormControl>
              </Timeline.Body>
            </Timeline.Item>

            {/* NO. 3 - Role */}
            <Timeline.Item>
              <Timeline.Badge className={`text-sm font-normal ${lora.className}`}>3</Timeline.Badge>
              <Timeline.Body className="border-0">
                <FormControl aria-label="role-field" className="flex-none border-0 border-red-500">
                  <FormControl.Label required requiredText="">
                    Tentukan tipe pengguna<span className="text-red-500">*</span>
                  </FormControl.Label>
                  <Select
                    placeholder="Pilih role"
                    style={{ width: 150 }}
                    onChange={(val) => setRoleInput(val)}
                    value={roleInput}
                    options={[
                      { value: 'mahasiswa', label: 'Mahasiswa' },
                      { value: 'staf', label: 'Staf' },
                      { value: 'admin', label: 'Admin (Jurusan)' },
                      { value: 'super_admin', label: 'Super Admin' },
                    ]}
                  />
                </FormControl>
              </Timeline.Body>
            </Timeline.Item>

            {/* Pilihan Kelas (Hanya muncul jika role mahasiswa) */}
            {roleInput === "mahasiswa" && (
              <Timeline.Item>
                <Timeline.Badge className={`text-sm font-normal ${lora.className}`}>*</Timeline.Badge>
                <Timeline.Body className="border-0">
                  <FormControl aria-label="kelas-field" className="flex-none border-0 border-red-500">
                    <FormControl.Label required={false}>
                      Pilih Kelas
                    </FormControl.Label>
                    <Select
                      placeholder="Pilih kelas (opsional)"
                      style={{ width: 150 }}
                      onChange={(val) => setKelasInput(val)}
                      value={kelasInput}
                      options={kelasList}
                      allowClear
                    />
                  </FormControl>
                </Timeline.Body>
              </Timeline.Item>
            )}

            {/* NO. 4 - Status */}
            <Timeline.Item>
              <Timeline.Badge className={`text-sm font-normal ${lora.className}`}>4</Timeline.Badge>
              <Timeline.Body>
                <FormControl aria-label="status-field" className="flex-none">
                  <FormControl.Label>
                    Status pengguna <span className="text-red-500">*</span>
                  </FormControl.Label>
                  <div className="flex items-center gap-5">
                    <span>Apakah aktif? </span>
                    <Switch 
                      className="flex items-center"
                      checkedChildren="Ya"
                      unCheckedChildren="Tidak"
                      checked={statusInput}
                      onChange={(checked) => setStatusInput(checked)}
                    />
                  </div>
                  <FormControl.Caption className="">
                    Jika tidak aktif, maka akun tersebut tidak dapat dipakai, hingga statusnya berubah menjadi <code>aktif</code>.
                  </FormControl.Caption>
                </FormControl>
              </Timeline.Body>
            </Timeline.Item>

            {/* NO. 5 - Simpan */}
            <Timeline.Item className="flex items-end">
              <Timeline.Badge className={`text-sm font-normal ${lora.className}`}>5</Timeline.Badge>
              <Timeline.Body>
                <Button 
                  variant="primary" 
                  onClick={handleSubmit}
                  disabled={isLoading}
                  ref={rippleOnSubmit}
                  onPointerDown={eventOnSubmit}
                >
                  {isLoading ? "Menyimpan..." : "Simpan"}
                </Button>
              </Timeline.Body>
            </Timeline.Item>
          </Timeline>
        </div>
      </main>
    </>
  )
}