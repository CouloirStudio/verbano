import { useContext } from "react";
import { AudioUploadContext } from "../contexts/app/AudioUploadContext";

function useAudioUpload() {
  const { uploadFile } = useContext(AudioUploadContext);

  return {
    uploadFile,
  };
}
