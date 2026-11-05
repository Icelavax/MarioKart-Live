import WeeklyReport from '../entity/WeeklyReport.js';

// <<Control>> GenerateWeeklyReportController - US45 Generate Weekly Report
export default class GenerateWeeklyReportController {
    // +generateWeeklyReport(reportWeek: Date): WeeklyReport
    generateWeeklyReport(reportWeek) {
        return new WeeklyReport().generateWeeklyReport(reportWeek);
    }
}
