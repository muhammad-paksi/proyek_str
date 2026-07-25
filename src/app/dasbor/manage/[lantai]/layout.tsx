import Link from "next/link";
import Header from "@/components/manage_users/header";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id; // Ambil ID dari URL

  return {
    title: `Kelola Pengguna | SI Diseminasi`,
    description: ``
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <Header />
      {children}
    </>
  )
}
