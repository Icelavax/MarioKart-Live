// bring in the shared counting and date helpers used by all three reports
import { countActivity, startOfDay, addDays } from './ReportData.js';

// <<Entity>> DailyReport - US44 Generate Daily Report
// ENTITY class DailyReport: holds the data and the business rules that need stored data
export default class DailyReport {
    // the fields of a daily report
    reportDate; totalActivities; breakdown; periodStart; periodEnd;

    // US44 +generateDailyReport(reportDate: Date): DailyReport
    // null when there is no activity data for the selected date (A1)
    generateDailyReport(reportDate) {
        // start of the chosen day (00:00)
        const from = startOfDay(new Date(reportDate));
        // end of the period = start of the next day
        const to = addDays(from, 1);
        // count all platform activity between those two times
        const { totalActivities, breakdown } = countActivity(from, to);
        // nothing happened that day -> no report (the page shows "no data")
        if (totalActivities === 0) return null;
        // make a new DailyReport object
        const report = new DailyReport();
        // the day this report is for
        report.reportDate = from;
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
