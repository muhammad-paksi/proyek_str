
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id; // Ambil ID dari URL
  
  return {
    title: `Autentikasi - Ujibase`,
    description: ``
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="flex items-center justify-left h-screen w-screen pl-30 bg-gray-100">
        {children}
      </main>
    </>
  )
}
