class ReportModel {
    constructor(public reportID: number, public reportContent: string, public templateType: string) {}
  
    generateReport() {
      // Logic for generating the report here
    }
  
    getReportContent() {
      // Logic for getting the report content here
      return this.reportContent;
    }
  }
  
  export default ReportModel;