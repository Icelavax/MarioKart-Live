import { countActivity, startOfWeek, addDays } from './ReportData.js';

// <<Entity>> WeeklyReport - US45 Generate Weekly Report
export default class WeeklyReport {
    reportWeek; totalActivities; breakdown; periodStart; periodEnd;

    // US45 +generateWeeklyReport(reportWeek: Date): WeeklyReport
    // null when there is no activity data for the selected week (A1)
    generateWeeklyReport(reportWeek) {
        const from = startOfWeek(new Date(reportWeek));
        const to = addDays(from, 7);
        const { totalActivities, breakdown } = countActivity(from, to);
        if (totalActivities === 0) return null;
        const report = new WeeklyReport();
        report.reportWeek = from;
        report.periodStart = from;
        report.periodEnd = addDays(to, -1);
        report.totalActivities = totalActivities;
        report.breakdown = breakdown;
        return report;
    }
}
