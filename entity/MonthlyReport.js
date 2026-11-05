// bring in the shared counting and date helpers used by all three reports
import { countActivity, startOfMonth, addDays } from './ReportData.js';

// <<Entity>> MonthlyReport - US46 Generate Monthly Report
// ENTITY class MonthlyReport: holds the data and the business rules that need stored data
export default class MonthlyReport {
    // the fields of a monthly report
    reportMonth; totalActivities; breakdown; periodStart; periodEnd;

    // US46 +generateMonthlyReport(reportMonth: Date): MonthlyReport
    // null when there is no activity data for the selected month (A1)
    generateMonthlyReport(reportMonth) {
        // the 1st day of the chosen month
        const from = startOfMonth(new Date(reportMonth));
        // end of the period = the 1st day of the next month
        const to = new Date(from.getFullYear(), from.getMonth() + 1, 1);
        // count all platform activity between those two times
        const { totalActivities, breakdown } = countActivity(from, to);
        // nothing happened that day -> no report (the page shows "no data")
        if (totalActivities === 0) return null;
        // make a new MonthlyReport object
        const report = new MonthlyReport();
        // the month this report is for
        report.reportMonth = from;
        // period starts at the start of the day
        report.periodStart = from;
        // period ends on the same day (shown to the user)
        report.periodEnd = addDays(to, -1);
        // total number of activities in that day
        report.totalActivities = totalActivities;
        // the counts per activity type (accounts, IDPs, views, saves)
        report.breakdown = breakdown;
        // give the finished report back to the controller
        return report;
    }
}
