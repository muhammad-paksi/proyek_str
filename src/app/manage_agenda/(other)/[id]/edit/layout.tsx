
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id; // Ambil ID dari URL

  return {
    title: `Edit agenda - ${id} | SI Diseminasi`,
    description: ``
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  )
}
