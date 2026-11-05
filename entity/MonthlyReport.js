import { countActivity, startOfMonth, addDays } from './ReportData.js';

// <<Entity>> MonthlyReport - US46 Generate Monthly Report
export default class MonthlyReport {
    reportMonth; totalActivities; breakdown; periodStart; periodEnd;

    // US46 +generateMonthlyReport(reportMonth: Date): MonthlyReport
    // null when there is no activity data for the selected month (A1)
    generateMonthlyReport(reportMonth) {
        const from = startOfMonth(new Date(reportMonth));
        const to = new Date(from.getFullYear(), from.getMonth() + 1, 1);
        const { totalActivities, breakdown } = countActivity(from, to);
        if (totalActivities === 0) return null;
        const report = new MonthlyReport();
        report.reportMonth = from;
        report.periodStart = from;
        report.periodEnd = addDays(to, -1);
        report.totalActivities = totalActivities;
        report.breakdown = breakdown;
        return report;
    }
}
