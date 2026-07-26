import { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { message, Upload } from 'antd';

const { Dragger } = Upload;

type UploadDropboxProps = {
  format?: string;
  onFileListChange?: (fileList: UploadFile[]) => void;
};

export default function UploadDropbox({ format, onFileListChange }: UploadDropboxProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    accept: format,
    listType: 'picture',
    fileList: fileList,
    // Prevent auto-upload — files will be uploaded by the parent on submit
    beforeUpload: (file) => {
      return false;
    },
    onChange(info) {
      setFileList(info.fileList);
      onFileListChange?.(info.fileList);
    },
    onRemove(file) {
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
    },
  };

  return (
    <>
      {contextHolder}
      <Dragger {...props} pastable>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Klik atau seret file ke sini untuk mengunggah</p>
        <p className="italic ant-upload-hint">
          Anda bisa memilih beberapa gambar sekaligus
        </p>
      </Dragger>
    </>
  );
};
