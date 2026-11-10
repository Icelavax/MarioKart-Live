// bring in ViewSavedIDPController - this page passes the user's request to it
import ViewSavedIDPController from '../control/ViewSavedIDPController.js';
// bring in Session - who is logged in and which role they have
import { Session } from './Session.js';
// bring in the shared field-check helpers we need: isPositiveInteger
import { isPositiveInteger } from './Validator.js';

// <<Boundary>> ViewSavedIDPPage - US34 View Saved IDP
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class ViewSavedIDPPage {
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // +viewSavedIDP(idpId: Integer): void   - customer selects a saved IDP, clicks "View"
    // BCE method viewSavedIDP() (gets: idpId)
    viewSavedIDP(idpId) {
        // if the ID is a valid positive number...
        const idp = isPositiveInteger(idpId)
            // ...ask the controller for this customer's saved IDP (otherwise null)
            ? new ViewSavedIDPController().viewSavedIDP(Session.userId, idpId) : null;
        if (idp != null) this.displayIDP(idp);         // idp != null
        else this.displayError('IDP not found');      // idp == null
    }

    // +displayIDP(idp: IDP): void
    // BCE method: show the saved IDP details (a copy)
    displayIDP(idp) { this.#show('data', 'Saved IDP details', { ...idp }); }

    // +displayError(message: String): void
    // BCE method: show the error message that was passed in (message)
    displayError(message) { this.#show('error', message); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[ViewSavedIDPPage] ${message ?? ''}`, data ?? '');
    }
}
