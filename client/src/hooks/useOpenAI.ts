import { useContext } from "react";
import { OpenAIContext } from "../contexts/api/OpenAIContext";

function useOpenAI() {
  const context = useContext(OpenAIContext);
  const getReport = async () => {
    // call the provideReportService of OpenAIContext
  };

  return {
    getReport,
  };
}
