import GenerateDailyReportController from '../control/GenerateDailyReportController.js';
import { parseDate } from './Validator.js';

// <<Boundary>> GenerateDailyReportPage - US44 Generate Daily Report
export default class GenerateDailyReportPage {
    reportDate = null;
    output = null;

    // +selectDate(reportDate: Date): void   (also accepts "YYYY-MM-DD" from the date picker)
    selectDate(reportDate) { this.reportDate = reportDate; }

    // +clickGenerateReport(): void
    clickGenerateReport() {
        const date = parseDate(this.reportDate);
        if (date == null) { this.displayError('Please select a report date'); return; }          // field validation (boundary)
        const report = new GenerateDailyReportController().generateDailyReport(date);
        if (report != null) this.displayReport(report);                                   // [Activity Data != Null]
        else this.displayError('No activity data found for the selected date.');    // [Activity Data = Null] (A1)
    }

    // +displayReport(report: DailyReport): void
    displayReport(report) { this.#show('data', 'Daily report', { ...report }); }

    // +displayError(message: String): void
    displayError(message) { this.#show('error', message); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[GenerateDailyReportPage] ${message ?? ''}`, data ?? '');
    }
}
