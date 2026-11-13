// ==========================================================================
// PRESENTATION NOTE
// US44 Generate Daily Report - <<Control>> GenerateDailyReportController
//
// What to say: The controller has one job: it takes the request from the boundary page and passes
//              it to DailyReport.generateDailyReport(), then hands the answer back. It has no
//              screen and holds no data.
//
// Q: Why have a controller if it only passes the call on?
// A: It keeps the screen and the data apart: the boundary never touches the entity directly. If
//    the business logic changes, only the controller and entity change, not the UI. That is the
//    BCE rule.
// ==========================================================================

// bring in the DailyReport entity class (it holds and checks the daily report data)
import DailyReport from '../entity/DailyReport.js';

// <<Control>> GenerateDailyReportController - US44 Generate Daily Report
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class GenerateDailyReportController {
    // +generateDailyReport(reportDate: Date): DailyReport
    // BCE method generateDailyReport() (gets: reportDate): called by the page
    generateDailyReport(reportDate) {
        // create a DailyReport entity and ask it to generate daily report with reportDate; hand its answer back to the page
        return new DailyReport().generateDailyReport(reportDate);
    }
}
