import Link from "next/link";
import Header from "@/components/manage_agenda/header";
import UnderlineNavigation from "@/components/manage_agenda/underline-nav";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id; // Ambil ID dari URL

  return {
    title: `Kelola Agenda | SI Diseminasi`,
    description: ``
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <Header />
      <UnderlineNavigation />
      {children}
    </>
  )
}
