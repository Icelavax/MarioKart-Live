// bring in the WeeklyReport entity class (it holds and checks the weekly report data)
import WeeklyReport from '../entity/WeeklyReport.js';

// <<Control>> GenerateWeeklyReportController - US45 Generate Weekly Report
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class GenerateWeeklyReportController {
    // +generateWeeklyReport(reportWeek: Date): WeeklyReport
    // BCE method generateWeeklyReport() (gets: reportWeek): called by the page
    generateWeeklyReport(reportWeek) {
        // create a WeeklyReport entity and ask it to generate weekly report with reportWeek; hand its answer back to the page
        return new WeeklyReport().generateWeeklyReport(reportWeek);
    }
}
