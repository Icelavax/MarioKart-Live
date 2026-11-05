import ViewIDPShortlistsController from '../control/ViewIDPShortlistsController.js';
import { isPositiveInteger } from './Validator.js';

// <<Boundary>> ViewIDPShortlistsPage - US38 View IDP Shortlists
export default class ViewIDPShortlistsPage {
    output = null;

    // +clickViewShortlists(idpID: int): void
    clickViewShortlists(idpID) {
        if (!isPositiveInteger(idpID)) { this.displayError('IDP not found'); return; }     // boundary
        const count = new ViewIDPShortlistsController().getShortlistCount(idpID);
        if (count >= 0) this.displayShortlistCount(count);           // [count >= 0] (0 = never shortlisted, A1)
        else this.displayError('IDP not found');                     // [count < 0]  (A2)
    }

    // +displayShortlistCount(count: int): void
    displayShortlistCount(count) { this.#show('data', `Shortlisted ${count} time(s)`, count); }

    // +displayError(message: String): void
    displayError(message) { this.#show('error', message); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[ViewIDPShortlistsPage] ${message ?? ''}`, data ?? '');
    }
}
