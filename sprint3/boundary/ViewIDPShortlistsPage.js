// ==========================================================================
// PRESENTATION NOTE
// US38 View IDP Shortlists - <<Boundary>> ViewIDPShortlistsPage
//
// What to say: This is the screen for US38. It first checks the input with Validator.js (blank
//              fields, formats). Only if the input is valid does it call
//              ViewIDPShortlistsController.getShortlistCount(), and then it shows the result with
//              displaySuccess() or displayError(), following the sequence diagram.
//
// Q: Why is field validation in the boundary and not in the entity?
// A: Bad input is stopped at the screen, so the controller and entity only ever receive clean
//    data. The entity only checks rules that need stored data (e.g. duplicates).
//
// Q: How is the shortlist count updated?
// A: When a customer saves an IDP (US32), SavedIDP.saveIDP() adds 1 to that IDP's shortlistCount.
// ==========================================================================

// bring in ViewIDPShortlistsController - this page passes the user's request to it
import ViewIDPShortlistsController from '../control/ViewIDPShortlistsController.js';
// bring in the shared field-check helpers we need: isPositiveInteger
import { isPositiveInteger } from './Validator.js';

// <<Boundary>> ViewIDPShortlistsPage - US38 View IDP Shortlists
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class ViewIDPShortlistsPage {
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // +clickViewShortlists(idpID: int): void
    // UI event: the actor does "click view shortlists" on the screen (gets: idpID)
    clickViewShortlists(idpID) {
        if (!isPositiveInteger(idpID)) { this.displayError('IDP not found'); return; }     // boundary
        // ask the controller how many customers saved this IDP
        const count = new ViewIDPShortlistsController().getShortlistCount(idpID);
        if (count >= 0) this.displayShortlistCount(count);           // [count >= 0] (0 = never shortlisted, A1)
        else this.displayError('IDP not found');                     // [count < 0]  (A2)
    }

    // +displayShortlistCount(count: int): void
    // BCE method: show the shortlist count, e.g. "Shortlisted 3 time(s)"
    displayShortlistCount(count) { this.#show('data', `Shortlisted ${count} time(s)`, count); }

    // +displayError(message: String): void
    // BCE method: show the error message that was passed in (message)
    displayError(message) { this.#show('error', message); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[ViewIDPShortlistsPage] ${message ?? ''}`, data ?? '');
    }
}
