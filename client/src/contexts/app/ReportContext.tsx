import { createContext, useContext, useState } from "react";

export const ReportContext = createContext({
    reportContent: "",
    reportState: false,
    generateReport: () => {},
    exportReport: () => {},
});