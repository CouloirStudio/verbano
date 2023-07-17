import { createContext, useContext, useState } from "react";

export const AudioUploadContext = createContext({
    uploadedFile: null,
    uploadState: false,
    uploadFile: () => {},
});