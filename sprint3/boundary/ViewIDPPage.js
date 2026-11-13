// ==========================================================================
// PRESENTATION NOTE
// US31 View IDP - <<Boundary>> ViewIDPPage
//
// What to say: This is the screen for US31. It passes the user's request to
//              ViewIDPController.viewIDP(), and then shows the result with displaySuccess() or
//              displayError(), following the sequence diagram.
//
// Q: What if the record does not exist or was deleted?
// A: The entity returns null and the page shows an error message instead of the details.
// ==========================================================================

// bring in ViewIDPController - this page passes the user's request to it
import ViewIDPController from '../control/ViewIDPController.js';

// <<Boundary>> ViewIDPPage - US31 View IDP
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class ViewIDPPage {
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // +selectIDP(idpId: Integer): void
    // UI event: the actor does "select idp" on the screen (gets: idpId)
    selectIDP(idpId) {
        // ask the controller for the IDP with this ID
        const idp = new ViewIDPController().viewIDP(idpId);
        if (idp != null) this.displayIDPDetails(idp);    // [IDP found]
        else this.displayError('IDP not found');         // [IDP not found]
    }

    // +displayIDPDetails(idp: IDP): void
    // BCE method: show the IDP details (a copy)
    displayIDPDetails(idp) { this.#show('data', 'IDP details', { ...idp }); }

    // +displayError(message: String): void
    // BCE method: show the error message that was passed in (message)
    displayError(message) { this.#show('error', message); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[ViewIDPPage] ${message ?? ''}`, data ?? '');
    }
}
