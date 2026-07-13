import { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { message, Upload } from 'antd';

const { Dragger } = Upload;

export default function UploadDropbox({ format }: { format?: string }) {
  const [messageApi, contextHolder] = message.useMessage();
  
  // 1. Buat state untuk memantau file yang ada di komponen
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    accept: format,

    // 2. Hubungkan komponen dengan state local
    // fileList: fileList,

    onChange(info) {
      const { status } = info.file;
      // Batasi hanya menyimpan 1 file terakhir (karena kebutuhan form Anda hanya 1 berkas)
      // setFileList(info.fileList);
      
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        messageApi.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        messageApi.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    onRemove() {
      // setFileList([]);
    }
  };

  return (
    <>
      {contextHolder}
      <Dragger {...props} listType="picture">
        {/* {fileList.length === 0 && ( */}
          <>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Klik atau seret file ke sini untuk mengunggah</p>
            <p className="italic ant-upload-hint">
              Anda bisa memilih beberapa gambar sekaligus
            </p>
          </>
        {/* )} */}
      </Dragger>
    </>
  );
};
