import Header from "@/components/my_class/header";
import { getUserRole } from "@/server/auth/get-role";
import { redirect } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id; // Ambil ID dari URL

  return {
    title: `Kelas saya | SI Diseminasi`,
    description: ``
  };
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const role = await getUserRole();
  if (role !== "mahasiswa") {
    redirect("/dasbor");
  }

  return (
    <>
      <Header />
      {children}
    </>
  )
}
