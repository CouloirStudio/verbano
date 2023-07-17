import React, { useContext } from "react";
import { AudioUploadContext } from "../../contexts/app/AudioUploadContext";
import Button from "../shared/Button";

const AudioUpload: React.FC = () => {
  const { uploadFile } = useContext(AudioUploadContext);

  return (
    <div>
      <Button onClick={uploadFile}>Upload Audio</Button>
    </div>
  );
};

export default AudioUpload;
