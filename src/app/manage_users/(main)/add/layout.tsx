
import UnderlineNavigation from "@/components/manage_agenda/underline-nav";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id; // Ambil ID dari URL

  return {
    title: `Tambah - User JTI | SI Diseminasi`,
    description: `This is where user is adding user who has more access to certain features.`
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  )
}
