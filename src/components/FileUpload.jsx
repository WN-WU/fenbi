import React, { useState } from 'react';
import { Upload, Button, message, Progress, Card } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';

const FileUpload = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const props = {
    name: 'file',
    action: 'http://localhost:5000/api/upload',
    accept: '.pdf,.docx',
    showUploadList: false,
    maxSize: 10 * 1024 * 1024, // 10MB限制
    beforeUpload: (file) => {
      const isValidType = file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      if (!isValidType) {
        message.error('只支持上传PDF或Word文档！');
        return Upload.LIST_IGNORE;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('文件大小不能超过10MB！');
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    onChange(info) {
      if (info.file.status === 'uploading') {
        setUploading(true);
        setProgress(Math.round((info.file.percent || 0)));
      }
      if (info.file.status === 'done') {
        setUploading(false);
        message.success(`${info.file.name} 上传成功`);
        onUploadSuccess(info.file.response.question);
      } else if (info.file.status === 'error') {
        setUploading(false);
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  return (
    <Card className="upload-container" style={{ maxWidth: 600, margin: '40px auto' }}>
      <Upload.Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
        <p className="ant-upload-hint">
          支持PDF和Word文档格式，文件大小不超过10MB
        </p>
      </Upload.Dragger>
      {uploading && (
        <div style={{ marginTop: '20px' }}>
          <Progress
            percent={progress}
            status="active"
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
        </div>
      )}
    </Card>
  );
};

export default FileUpload;