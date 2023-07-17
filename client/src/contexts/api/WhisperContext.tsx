import { createContext, useContext, useState } from "react";

export const WhisperContext = createContext({
    provideTranscriptionService: async () => {},
});