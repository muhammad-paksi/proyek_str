"use client"

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Carousel, DatePicker, Input, type GetProps } from 'antd'
import Tooltip from "@mui/material/Tooltip";
import { useRipple } from 'use-ripple-hook';
import { useQuery } from "@tanstack/react-query";
import { Card, Button as ButtonHero } from "@heroui/react";
import { Table, DataTable } from '@primer/react/experimental';
import { Calendar1, CalendarX, ClipboardList, ListPlus, Menu } from "lucide-react";
import { KebabHorizontalIcon } from '@primer/octicons-react';
import { ActionList, ActionMenu, IconButton, Text } from '@primer/react';
import { lora, mona_sans, noto_sans, shantell_sans, suse } from "@/lib/font";
import TableAgenda from "@/components/manage_agenda/tabel";
// Import Day.js library and its matching locale
import dayjs from 'dayjs';
import 'dayjs/locale/id';

// Activate the Day.js locale globally
dayjs.locale('id');

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;
const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);

export default function Page() {

  return (
    <>
      <main className="w-screen h-[73vh] pl-10 pr-10 pt-3">
        <div className="mb-5 w-full flex gap-3 items-center justify-end">
          <DatePicker format={"DD MMM YYYY"} placeholder="Pilih Tanggal" className="w-xs" suffixIcon={<Calendar1 className="text-blue-400" size={16} strokeWidth={2} />} />
          <Search placeholder="Cari nama agenda" onSearch={onSearch} enterButton />
        </div>
        <TableAgenda />
      </main>
    </>
  )
}

/** Raw row type matching the agenda schema */
type AgendaRow = {
  id: number;
  nama: string | null;
  deskripsi?: string | null;
  waktu: Date;
  imageNumber: number | null;
};

/** Grouped agenda: rows with same nama+waktu merged, images collected */
type GroupedAgenda = {
  /** Composite key for DataTable: "nama|waktu" */
  id: string;
  nama: string | null;
  deskripsi: string | null;
  waktu: Date;
  images: { idAgenda: number; imageURL: string }[];
  /** All idAgenda values in this group */
  ids: number[];
};