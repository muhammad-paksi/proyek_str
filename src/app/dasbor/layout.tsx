
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
      {children}
      {/* page.tsx ada di dalam "/[lantai]/page.tsx" */}
    </>
  )
}
