import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Modal, Upload, UploadFile, message } from "antd";
import { UploadProps } from "antd/es/upload";
import React, { useEffect, useState } from "react";


interface HeaderPicProps {
  value?: string;
  onChange?: changeFuntion;
}

type changeFuntion = (value: string) => void;

let onChange: changeFuntion | undefined;

const HeaderPic: React.FC = (props: HeaderPicProps) => {
  onChange = props.onChange;

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    props.value
      ? setFileList([
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: `${props.value}`,
          },
        ])
      : setFileList([]);
  }, [props.value]);

  const handlePreview = async (file: UploadFile) => {
    console.log(JSON.stringify(file));
    setPreviewImage(file.thumbUrl ?? "");
    setPreviewOpen(true);
  };
  const handleCancel = () => {
    setPreviewOpen(false);
  };

  const handleRemove = () => {
    setFileList([]);
  };

  const handleChange: UploadProps["onChange"] = (params) => {
    if (params.file?.status === "uploading") {
      setLoading(true);
    } else if (params.file?.status === "done") {
      setLoading(false);
      const data = params.fileList[0].response?.data;
      console.log(data);
      const decode = decodeURIComponent(data);
      console.log(decode);
      params.fileList[0].response = {
        ...params.fileList[0].response,
        data: `http://localhost:3000/${decodeURIComponent(params.fileList[0].response?.data)}`,
      };
      console.log(params.fileList[0].response.data);
      if (onChange) {
        onChange(params.fileList[0].response?.data);
      }
    }
    console.log(params.fileList[0].response);
    setFileList([...params.fileList]);
  };
  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
      message.error("Image must smaller than 10MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div>
      <Upload
        listType="picture-circle"
        fileList={fileList}
        openFileDialogOnClick={true}
        onPreview={handlePreview}
        onRemove={handleRemove}
        onChange={handleChange}
        beforeUpload={beforeUpload}
        action={"http://localhost:3000/user/upload"}
      >
        {fileList && fileList.length >= 1 ? null : uploadButton}
      </Upload>
      <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default HeaderPic;
