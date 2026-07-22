
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id; // Ambil ID dari URL

  return {
    title: `Lihat - Agenda JTI | SI Diseminasi`,
    description: `This is where user is viewing information of a specific agenda.`
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  )
}
