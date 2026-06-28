
import Link from 'next/link';
import { Building2 } from 'lucide-react';

export default function NavMenuWrapper({ href = "/dasbor", children }: { href?: string; children?: React.ReactNode }) {
  return (
    <>
      <Link href={href} prefetch={false} className="border-0 group flex items-center gap-3 ml-1 mr-0.75 pl-3 pr-2 py-1.25 hover:bg-gray-100 rounded-md">
        {children}
      </Link>
    </>
  )
}