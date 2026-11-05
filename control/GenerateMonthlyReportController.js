// bring in the MonthlyReport entity class (it holds and checks the monthly report data)
import MonthlyReport from '../entity/MonthlyReport.js';

// <<Control>> GenerateMonthlyReportController - US46 Generate Monthly Report
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class GenerateMonthlyReportController {
    // +generateMonthlyReport(reportMonth: Date): MonthlyReport
    // BCE method generateMonthlyReport() (gets: reportMonth): called by the page
    generateMonthlyReport(reportMonth) {
        // create a MonthlyReport entity and ask it to generate monthly report with reportMonth; hand its answer back to the page
        return new MonthlyReport().generateMonthlyReport(reportMonth);
    }
}
