import React, { useContext } from "react";
import { ReportContext } from "../../contexts/app/ReportContext";
import Button from "../shared/Button";

const Report: React.FC = () => {
  const { generateReport, exportReport } = useContext(ReportContext);

  return (
    <div>
      <Button onClick={generateReport}>Generate Report</Button>
      <Button onClick={exportReport}>Export Report</Button>
    </div>
  );
};

export default Report;
