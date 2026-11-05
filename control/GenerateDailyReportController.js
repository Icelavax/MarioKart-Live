import DailyReport from '../entity/DailyReport.js';

// <<Control>> GenerateDailyReportController - US44 Generate Daily Report
export default class GenerateDailyReportController {
    // +generateDailyReport(reportDate: Date): DailyReport
    generateDailyReport(reportDate) {
        return new DailyReport().generateDailyReport(reportDate);
    }
}
