// bring in GenerateWeeklyReportController - this page passes the user's request to it
import GenerateWeeklyReportController from '../control/GenerateWeeklyReportController.js';
// bring in the shared field-check helpers we need: parseDate
import { parseDate } from './Validator.js';

// <<Boundary>> GenerateWeeklyReportPage - US45 Generate Weekly Report
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class GenerateWeeklyReportPage {
    // the week picked by the Platform Manager (none yet)
    reportWeek = null;
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // +selectWeek(reportWeek: Date): void   (also accepts "YYYY-MM-DD" from the date picker)
    // BCE method: remember the week (any day in it) the actor picked
    selectWeek(reportWeek) { this.reportWeek = reportWeek; }

    // +clickGenerateReport(): void
    // UI event: the actor does "click generate report" on the screen
    clickGenerateReport() {
        // BOUNDARY validation: turn the picked day into a real date (null if invalid)
        const date = parseDate(this.reportWeek);
        if (date == null) { this.displayError('Please select a day in the report week'); return; }          // field validation (boundary)
        // ask the controller for the report for that week (null if there was no activity)
        const report = new GenerateWeeklyReportController().generateWeeklyReport(date);
        if (report != null) this.displayReport(report);                                   // [Activity Data != Null]
        else this.displayError('No activity data found for the selected week.');    // [Activity Data = Null] (A1)
    }

    // +displayReport(report: WeeklyReport): void
    // BCE method: show the report figures
    displayReport(report) { this.#show('data', 'Weekly report', { ...report }); }

    // +displayError(message: String): void
    // BCE method: show the error message that was passed in (message)
    displayError(message) { this.#show('error', message); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[GenerateWeeklyReportPage] ${message ?? ''}`, data ?? '');
    }
}
