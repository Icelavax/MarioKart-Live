import GenerateWeeklyReportController from '../control/GenerateWeeklyReportController.js';
import { parseDate } from './Validator.js';

// <<Boundary>> GenerateWeeklyReportPage - US45 Generate Weekly Report
export default class GenerateWeeklyReportPage {
    reportWeek = null;
    output = null;

    // +selectWeek(reportWeek: Date): void   (also accepts "YYYY-MM-DD" from the date picker)
    selectWeek(reportWeek) { this.reportWeek = reportWeek; }

    // +clickGenerateReport(): void
    clickGenerateReport() {
        const date = parseDate(this.reportWeek);
        if (date == null) { this.displayError('Please select a day in the report week'); return; }          // field validation (boundary)
        const report = new GenerateWeeklyReportController().generateWeeklyReport(date);
        if (report != null) this.displayReport(report);                                   // [Activity Data != Null]
        else this.displayError('No activity data found for the selected week.');    // [Activity Data = Null] (A1)
    }

    // +displayReport(report: WeeklyReport): void
    displayReport(report) { this.#show('data', 'Weekly report', { ...report }); }

    // +displayError(message: String): void
    displayError(message) { this.#show('error', message); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[GenerateWeeklyReportPage] ${message ?? ''}`, data ?? '');
    }
}
