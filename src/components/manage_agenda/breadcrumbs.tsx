"use client";

import { useParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Breadcrumbs } from '@heroui/react';
import { suse } from '@/lib/font';

export default function AgendaBreadcrumbs() {
  const { id } = useParams();
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  return (
    <Breadcrumbs>
      <Breadcrumbs.Item href='/dasbor' key={0} className={suse.className}>
        Dashboard
      </Breadcrumbs.Item>
      <Breadcrumbs.Item href={`/manage_agenda`} key={1} className={suse.className}>
        agenda
      </Breadcrumbs.Item>
      <Breadcrumbs.Item href={`${pathname}`} key={2} className={suse.className}>
        view
      </Breadcrumbs.Item>
      <Breadcrumbs.Item href={`${pathname}`} key={3} className={suse.className}>
        {id}
      </Breadcrumbs.Item>
    </Breadcrumbs>
  )
}