"use client"

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DatePicker, Input, type GetProps } from 'antd'
import { Dialog } from '@primer/react/experimental';
import { Calendar1 } from "lucide-react";
import { mona_sans, noto_sans } from "@/lib/font";
import TableAgenda from "@/components/manage_agenda/tabel";
import { deleteAgenda } from "@/server/agenda";

// Import Day.js library and its matching locale
import dayjs from 'dayjs';
import 'dayjs/locale/id';

// Activate the Day.js locale globally
dayjs.locale('id');

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;
const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);

export default function Page() {
  const queryClient = useQueryClient();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    nama: string;
    triggerEl: HTMLElement | null;
  }>({ id: 0, nama: "", triggerEl: null });

  const handleClose = () => {
    setDeleteTarget({ id: -1, nama: "", triggerEl: null });
    setIsDeleteOpen(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAgenda({ id: deleteTarget.id });
      await queryClient.invalidateQueries({ queryKey: ["manage-agenda"] });
      handleClose();
    } catch (e) {
      console.error("Failed to delete agenda:", e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <main className="w-screen h-[73vh] pl-10 pr-10 pt-3">
        <div className="mb-5 w-full flex gap-3 items-center justify-end">
          <DatePicker format={"DD MMM YYYY"} placeholder="Pilih Tanggal" className="w-xs" suffixIcon={<Calendar1 className="text-blue-400" size={16} strokeWidth={2} />} />
          <Search placeholder="Cari nama agenda" onSearch={onSearch} enterButton />
        </div>
        <TableAgenda 
          onSelectDelete={(id, nama, element) => {
            setDeleteTarget({ id, nama, triggerEl: element });
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
              content: <span className={`font-semibold ${mona_sans.className}`}>Batal</span>, 
              onClick: handleClose
            }, {
              buttonType: 'danger', 
              content: <span className={`font-semibold ${mona_sans.className}`}>{isDeleting ? 'Menghapus...' : 'Hapus'}</span>,
              onClick: handleDelete,
              disabled: isDeleting,
            },
          ]}
          returnFocusRef={{ current: deleteTarget.triggerEl ?? null }}
        >
          <p className={`${noto_sans.className}`}>
            Apakah Anda yakin ingin menghapus agenda <strong>"{deleteTarget.nama}"</strong>? Semua file terkait juga akan dihapus.
          </p>
        </Dialog>
      )}
    </>
  )
}
