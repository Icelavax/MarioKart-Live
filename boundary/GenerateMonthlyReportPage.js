import GenerateMonthlyReportController from '../control/GenerateMonthlyReportController.js';
import { parseDate } from './Validator.js';

// <<Boundary>> GenerateMonthlyReportPage - US46 Generate Monthly Report
export default class GenerateMonthlyReportPage {
    reportMonth = null;
    output = null;

    // +selectMonth(reportMonth: Date): void   (also accepts "YYYY-MM-DD" or "YYYY-MM" from the date picker)
    selectMonth(reportMonth) { this.reportMonth = reportMonth; }

    // +clickGenerateReport(): void
    clickGenerateReport() {
        const date = parseDate(this.reportMonth);
        if (date == null) { this.displayError('Please select a report month and year'); return; }          // field validation (boundary)
        const report = new GenerateMonthlyReportController().generateMonthlyReport(date);
        if (report != null) this.displayReport(report);                                   // [Activity Data != Null]
        else this.displayError('No activity data found for the selected month.');    // [Activity Data = Null] (A1)
    }

    // +displayReport(report: MonthlyReport): void
    displayReport(report) { this.#show('data', 'Monthly report', { ...report }); }

    // +displayError(message: String): void
    displayError(message) { this.#show('error', message); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[GenerateMonthlyReportPage] ${message ?? ''}`, data ?? '');
    }
}
