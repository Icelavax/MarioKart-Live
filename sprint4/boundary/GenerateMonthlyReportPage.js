// bring in GenerateMonthlyReportController - this page passes the user's request to it
import GenerateMonthlyReportController from '../control/GenerateMonthlyReportController.js';
// bring in the shared field-check helpers we need: parseDate
import { parseDate } from './Validator.js';

// <<Boundary>> GenerateMonthlyReportPage - US46 Generate Monthly Report
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class GenerateMonthlyReportPage {
    // the month picked by the Platform Manager (none yet)
    reportMonth = null;
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // +selectMonth(reportMonth: Date): void   (also accepts "YYYY-MM-DD" or "YYYY-MM" from the date picker)
    // BCE method: remember the month the actor picked
    selectMonth(reportMonth) { this.reportMonth = reportMonth; }

    // +clickGenerateReport(): void
    // UI event: the actor does "click generate report" on the screen
    clickGenerateReport() {
        // BOUNDARY validation: turn the picked month into a real date (null if invalid)
        const date = parseDate(this.reportMonth);
        if (date == null) { this.displayError('Please select a report month and year'); return; }          // field validation (boundary)
        // ask the controller for the report for that month (null if there was no activity)
        const report = new GenerateMonthlyReportController().generateMonthlyReport(date);
        if (report != null) this.displayReport(report);                                   // [Activity Data != Null]
        else this.displayError('No activity data found for the selected month.');    // [Activity Data = Null] (A1)
    }

    // +displayReport(report: MonthlyReport): void
    // BCE method: show the report figures
    displayReport(report) { this.#show('data', 'Monthly report', { ...report }); }

    // +displayError(message: String): void
    // BCE method: show the error message that was passed in (message)
    displayError(message) { this.#show('error', message); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[GenerateMonthlyReportPage] ${message ?? ''}`, data ?? '');
    }
}
