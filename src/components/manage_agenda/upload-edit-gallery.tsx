import { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { message, Upload } from 'antd';
import type { GetProp } from 'antd';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

type ExistingImage = {
  id: number;
  url: string;
};

type UploadEditGalleryProps = {
  /** Daftar gambar existing dari server */
  existingImages?: ExistingImage[];
  /** Format file yang diterima, misal "image/*" */
  format?: string;
  /** Callback saat ada gambar existing yang dihapus */
  onDeleteExisting?: (deletedIds: number[]) => void;
  /** Callback saat fileList berubah (termasuk file baru) */
  onFileListChange?: (fileList: UploadFile[]) => void;
};

/**
 * Konversi gambar existing dari server ke format UploadFile antd.
 * File dengan status 'done' akan ditampilkan sebagai thumbnail
 * yang sudah ter-upload, lengkap dengan tombol hapus (✕).
 */
function toUploadFileList(images: ExistingImage[]): UploadFile[] {
  return images.map((img) => ({
    uid: `existing-${img.id}`,
    name: `Gambar ${img.id}`,
    status: 'done' as const,
    url: img.url,
    thumbUrl: img.url,
  }));
}

export default function UploadEditGallery({
  existingImages = [],
  format,
  onDeleteExisting,
  onFileListChange,
}: UploadEditGalleryProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // Sinkronkan gambar existing dari server ke fileList saat data berubah
  useEffect(() => {
    if (existingImages.length > 0) {
      setFileList(toUploadFileList(existingImages));
    }
  }, [existingImages]);

  const handleChange: UploadProps['onChange'] = (info) => {
    setFileList(info.fileList);
    onFileListChange?.(info.fileList);

    const { status } = info.file;
    if (status === 'done') {
      messageApi.success(`${info.file.name} berhasil diunggah.`);
    } else if (status === 'error') {
      messageApi.error(`${info.file.name} gagal diunggah.`);
    }
  };

  const handleRemove = (file: UploadFile) => {
    // Cek apakah ini gambar existing (uid diawali "existing-")
    if (file.uid.startsWith('existing-')) {
      const imageId = Number(file.uid.replace('existing-', ''));
      const newDeletedIds = [...deletedIds, imageId];
      setDeletedIds(newDeletedIds);
      onDeleteExisting?.(newDeletedIds);
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    accept: format,
    listType: 'picture-card',
    fileList: fileList,
    onChange: handleChange,
    onRemove: handleRemove,
    onPreview: handlePreview,
  };

  return (
    <>
      {contextHolder}
      <Upload {...uploadProps}>
        <button
          type="button"
          className="flex flex-col items-center justify-center border-0 bg-transparent cursor-pointer"
        >
          <PlusOutlined />
          <div className="mt-2 text-xs">Tambah berkas</div>
        </button>
      </Upload>

      {previewOpen && (
        <div
          className="fixed inset-0 z-1000 flex items-center justify-center bg-black/60"
          onClick={() => setPreviewOpen(false)}
        >
          <img
            src={previewImage}
            alt="Preview"
            className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

/** Konversi file ke Base64 untuk preview lokal */
function getBase64(file: FileType): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
