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
