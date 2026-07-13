import Link from "next/link";
import Header from "@/components/manage_agenda/header";
import { mona_sans, noto_sans, suse } from "@/lib/font";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id; // Ambil ID dari URL

  return {
    title: ``,
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
