"use client"

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Text, Timeline, FormControl } from '@primer/react';
import { google_sans_flex, lora, mona_sans, noto_sans } from "@/lib/font";
import { getUserDetail } from "@/server/user";
import { Tag } from "antd";

export default function Page() {
  const { id } = useParams();

  const {
    data: userDetail,
    isLoading: isUserLoading,
  } = useQuery({
    queryKey: ["manage-users", id],
    refetchOnMount: true,
    queryFn: async () => {
      const result = await getUserDetail({ idUser: Number(id) });
      return result?.data ?? null;
    }
  });

  if (isUserLoading) return <div className="p-10">Memuat data...</div>;
  if (!userDetail) return <div className="p-10">Data tidak ditemukan.</div>;

  return (
    <>
      <main className="border-r-0 border-r-red-400 w-full overflow-hidden pl-20">
        <div className="h-fit max-w-full flex flex-col gap-4 pt-8 pb-2 px-4 border-r-0 border-r-gray-400 border-0 font-sans bg-white">
          <div>
            <h2 className={`mb-1 text-xl font-semibold ${lora.className}`}>
              Detail Pengguna
            </h2>
            <Text size="medium" weight="normal" className="block text-neutral-500">
              Berikut adalah informasi mengenai pengguna yang dipilih.&#10;
            </Text>
          </div>

          <Timeline clipSidebar>
            {/* NO. 1 */}
            <Timeline.Item>
              <Timeline.Badge className={`text-sm font-normal ${lora.className}`}>1</Timeline.Badge>
              <Timeline.Body>
                <Text className={`text-black font-medium`}>Username</Text>
                <p className={`text-base font-normal ${mona_sans.className}`}>{userDetail.username}</p>
              </Timeline.Body>
            </Timeline.Item>

            {/* NO. 2 */}
            <Timeline.Item>
              <Timeline.Badge className={`text-sm font-normal ${lora.className}`}>2</Timeline.Badge>
              <Timeline.Body>
                <FormControl aria-label="role-field" className="flex-none border-0">
                  <FormControl.Label className="mb-1">
                    <Text className={`text-black font-medium`}>Role</Text>
                  </FormControl.Label>
                  <p className={`font-normal ${mona_sans.className} capitalize`}>
                    {userDetail.role}
                  </p>
                </FormControl>
              </Timeline.Body>
            </Timeline.Item>
            
            {/* NO. 3 */}
            <Timeline.Item>
              <Timeline.Badge className={`text-sm font-normal ${lora.className}`}>3</Timeline.Badge>
              <Timeline.Body>
                <FormControl aria-label="status-field" className="flex-none border-0">
                  <FormControl.Label className="mb-1">
                    <Text className={`text-black font-medium`}>Status</Text>
                  </FormControl.Label>
                  <div className="mt-1">
                    {userDetail.status === "active" 
                      ? <Tag color="#41ab5d" variant="outlined" className="rounded-full! font-medium">active</Tag>
                      : <Tag color="#ff5f1f" variant="outlined" className="rounded-full! font-medium">inactive</Tag>}
                  </div>
                </FormControl>
              </Timeline.Body>
            </Timeline.Item>
          </Timeline>

          <Link
            href={`/manage_users/${userDetail.id}/edit`}
            className="mt-2 max-w-xs group flex items-center gap-3 rounded-lg border border-blue-100 bg-linear-to-r from-blue-50 to-white px-4 py-3 no-underline transition-all duration-200 hover:border-blue-300 hover:shadow-md hover:from-blue-100 hover:to-blue-50"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm transition-transform duration-200 group-hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
            </span>
            <span className="flex flex-col">
              <span className={`text-sm font-semibold text-blue-700 group-hover:text-blue-800 ${google_sans_flex.className}`}>
                Edit pengguna ini
              </span>
              <span className={`text-xs text-gray-400 group-hover:text-gray-500 ${noto_sans.className}`}>
                Ubah informasi pengguna
              </span>
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto text-blue-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-blue-500"><path d="m9 18 6-6-6-6" /></svg>
          </Link>
        </div>
      </main>
    </>
  )
}