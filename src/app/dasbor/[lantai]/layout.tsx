
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ lantai: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const lantai = resolvedParams.lantai;

  const formattedLantai = lantai ? lantai.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '';

  return {
    title: `${formattedLantai} - Dashboard Sistem Diseminasi`,
    description: `Halaman pemantauan untuk ${formattedLantai}`,
  };
}

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lantai: string }>; // Typed as a Promise
}

export default async function Layout({ children, params }: LayoutProps) {
  const resolvedParams = await params;
  const lantai = resolvedParams.lantai; // Accesses '[lantai]'

  const validFloors = ["lantai_6", "lantai_7", "lantai_8"];
  if (!lantai || !validFloors.includes(lantai)) {
    redirect('/dasbor/lantai_6');
  }

  return (
    <>
      {children}
    </>
  );
}