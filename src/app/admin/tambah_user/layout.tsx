
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id; // Ambil ID dari URL

  return {
    title: `Masuk - SI`,
    description: `Ini adalah halaman bagi pengguna yang belum terautentikasi untuk masuk ke akun mereka, jika ada.`,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}
