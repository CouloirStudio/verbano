class ReportController {
    constructor(private templateType: string, private reportContent: string = '') {}
  
    async generateReport(): Promise<string> {
      // logic to generate report here
      return 'report'; // placeholder
    }
  
    async exportReport(): Promise<void> {
      // logic to export report here
    }
  }
  
  export default ReportController;