"use client"

import { useMemo, useRef, useState } from "react";
import { Calendar1 } from "lucide-react";
import { Dialog } from '@primer/react/experimental';
import { DatePicker, Input, type GetProps } from 'antd'
import { lora, mona_sans, noto_sans, nunito, roboto, shantell_sans, suse } from "@/lib/font";

// Import Day.js library and its matching locale
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import TableUser from "@/components/manage_users/tabel";

// Activate the Day.js locale globally
dayjs.locale('id');

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;
const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);

export default function Page() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    username: string;
    triggerEl: HTMLElement | null;
  }>({ id: 0, username: "", triggerEl: null });
  // const returnFocusRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    setDeleteTarget({ id: -1, username: "", triggerEl: null });
    setIsDeleteOpen(false);
  };

  return (
    <>
      <main className="w-screen h-[73vh] pl-10 pr-10 pt-3">
        <div className="mb-5 w-60 flex gap-3 items-center justify-end">
          {/* <DatePicker format={"DD MMM YYYY"} placeholder="Pilih Tanggal" className="w-xs" suffixIcon={<Calendar1 className="text-blue-400" size={16} strokeWidth={2} />} /> */}
          <Search placeholder="Cari username pengguna" onSearch={onSearch} enterButton />
        </div>
        <TableUser 
          onSelectDelete={(id, username, element) => {
            setDeleteTarget({ id, username, triggerEl: element });
            setIsDeleteOpen(true);
          }} 
        />
      </main>
      {isDeleteOpen && (
        <Dialog
          title= {<span className={`font-semibold ${mona_sans.className}`}>Hapus agenda</span>}  
          onClose= { handleClose }
          footerButtons={[
            {
              buttonType: 'default', 
              content: <span className={`font-semibold ${mona_sans.className}`}>Cancel</span>, 
              onClick: handleClose
            }, {
              buttonType: 'danger', 
              content: <span className={`font-semibold ${mona_sans.className}`}>Delete the universe</span>
            },
          ]}
          returnFocusRef={{ current: deleteTarget.triggerEl ?? null }}
        >
          <p className={`${mona_sans.className}`}>
            This is where the dialog content would go.
          </p>
        </Dialog>
      )}
    </>
  )
}
