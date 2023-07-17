import { createContext, useContext, useState } from "react";

export const OpenAIContext = createContext({
    provideReportService: async () => {},
});
