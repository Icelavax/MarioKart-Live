import { countActivity, startOfDay, addDays } from './ReportData.js';

// <<Entity>> DailyReport - US44 Generate Daily Report
export default class DailyReport {
    reportDate; totalActivities; breakdown; periodStart; periodEnd;

    // US44 +generateDailyReport(reportDate: Date): DailyReport
    // null when there is no activity data for the selected date (A1)
    generateDailyReport(reportDate) {
        const from = startOfDay(new Date(reportDate));
        const to = addDays(from, 1);
        const { totalActivities, breakdown } = countActivity(from, to);
        if (totalActivities === 0) return null;
        const report = new DailyReport();
        report.reportDate = from;
        report.periodStart = from;
        report.periodEnd = addDays(to, -1);
        report.totalActivities = totalActivities;
        report.breakdown = breakdown;
        return report;
    }
}
