import { createContext, useContext, useState } from "react";

export const RecorderContext = createContext({
    recordingState: false,
    audioData: null,
    startRecording: () => {},
    stopRecording: () => {},
});