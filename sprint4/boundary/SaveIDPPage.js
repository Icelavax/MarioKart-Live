// bring in SaveIDPController - this page passes the user's request to it
import SaveIDPController from '../control/SaveIDPController.js';
// bring in Session - who is logged in and which role they have
import { Session } from './Session.js';
// bring in the shared field-check helpers we need: isPositiveInteger
import { isPositiveInteger } from './Validator.js';

// <<Boundary>> SaveIDPPage - US32 Save IDP
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class SaveIDPPage {
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // +selectSave(idpId: Integer): void   - customer clicks "Save" on the IDP being viewed
    // UI event: the actor does "select save" on the screen (gets: idpId)
    selectSave(idpId) {
        if (!isPositiveInteger(idpId)) { this.displayError('IDP not found'); return; }    // boundary
        // ask the controller to save this IDP for the logged-in customer
        const success = new SaveIDPController().saveIDP(Session.userId, idpId);
        if (success === true) this.displaySuccess('IDP saved');            // [IDP saved successfully]
        else this.displayError('IDP already saved');                      // [IDP already saved]
    }

    // +displaySuccess(message: String): void
    // BCE method: show the success message that was passed in (message)
    displaySuccess(message) { this.#show('success', message); }

    // +displayError(message: String): void
    // BCE method: show the error message that was passed in (message)
    displayError(message) { this.#show('error', message); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[SaveIDPPage] ${message ?? ''}`, data ?? '');
    }
}
