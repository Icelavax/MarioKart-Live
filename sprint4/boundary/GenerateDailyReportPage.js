// ==========================================================================
// PRESENTATION NOTE
// US44 Generate Daily Report - <<Boundary>> GenerateDailyReportPage
//
// What to say: This is the screen for US44. It first checks the input with Validator.js (blank
//              fields, formats). Only if the input is valid does it call
//              GenerateDailyReportController.generateDailyReport(), and then it shows the result
//              with displaySuccess() or displayError(), following the sequence diagram.
//
// Q: Why is field validation in the boundary and not in the entity?
// A: Bad input is stopped at the screen, so the controller and entity only ever receive clean
//    data. The entity only checks rules that need stored data (e.g. duplicates).
//
// Q: Where does the report data come from?
// A: ReportData.countActivity() counts accounts created, IDPs created, IDP views and IDPs saved
//    inside the chosen period. The weekly report runs Monday to Sunday.
// ==========================================================================

// bring in GenerateDailyReportController - this page passes the user's request to it
import GenerateDailyReportController from '../control/GenerateDailyReportController.js';
// bring in the shared field-check helpers we need: parseDate
import { parseDate } from './Validator.js';

// <<Boundary>> GenerateDailyReportPage - US44 Generate Daily Report
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class GenerateDailyReportPage {
    // the date picked by the Platform Manager (none yet)
    reportDate = null;
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // +selectDate(reportDate: Date): void   (also accepts "YYYY-MM-DD" from the date picker)
    // BCE method: remember the date the actor picked
    selectDate(reportDate) { this.reportDate = reportDate; }

    // +clickGenerateReport(): void
    // UI event: the actor does "click generate report" on the screen
    clickGenerateReport() {
        // BOUNDARY validation: turn the picked date into a real date (null if it is not a valid date)
        const date = parseDate(this.reportDate);
        if (date == null) { this.displayError('Please select a report date'); return; }          // field validation (boundary)
        // ask the controller for the report for that day (null if there was no activity)
        const report = new GenerateDailyReportController().generateDailyReport(date);
        if (report != null) this.displayReport(report);                                   // [Activity Data != Null]
        else this.displayError('No activity data found for the selected date.');    // [Activity Data = Null] (A1)
    }

    // +displayReport(report: DailyReport): void
    // BCE method: show the report figures
    displayReport(report) { this.#show('data', 'Daily report', { ...report }); }

    // +displayError(message: String): void
    // BCE method: show the error message that was passed in (message)
    displayError(message) { this.#show('error', message); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[GenerateDailyReportPage] ${message ?? ''}`, data ?? '');
    }
}
