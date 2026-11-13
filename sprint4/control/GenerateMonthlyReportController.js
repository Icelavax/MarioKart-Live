// ==========================================================================
// PRESENTATION NOTE
// US46 Generate Monthly Report - <<Control>> GenerateMonthlyReportController
//
// What to say: The controller has one job: it takes the request from the boundary page and passes
//              it to MonthlyReport.generateMonthlyReport(), then hands the answer back. It has no
//              screen and holds no data.
//
// Q: Why have a controller if it only passes the call on?
// A: It keeps the screen and the data apart: the boundary never touches the entity directly. If
//    the business logic changes, only the controller and entity change, not the UI. That is the
//    BCE rule.
// ==========================================================================

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
