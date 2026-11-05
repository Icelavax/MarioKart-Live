import MonthlyReport from '../entity/MonthlyReport.js';

// <<Control>> GenerateMonthlyReportController - US46 Generate Monthly Report
export default class GenerateMonthlyReportController {
    // +generateMonthlyReport(reportMonth: Date): MonthlyReport
    generateMonthlyReport(reportMonth) {
        return new MonthlyReport().generateMonthlyReport(reportMonth);
    }
}
