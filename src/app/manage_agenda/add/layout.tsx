
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id; // Ambil ID dari URL

  return {
    title: `Tambah poster - Agenda JTI | SI Diseminasi`,
    description: `This is where user is uploading images containing agenda info for specific date.`
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  )
}
