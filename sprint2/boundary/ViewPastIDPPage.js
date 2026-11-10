// bring in ViewPastIDPController - this page passes the user's request to it
import ViewPastIDPController from '../control/ViewPastIDPController.js';
// bring in IDPStatus from the IDP entity file
import { IDPStatus } from '../entity/IDP.js';
// bring in Session - who is logged in and which role they have
import { Session } from './Session.js';

// <<Boundary>> ViewPastIDPPage - US26 View Past IDP
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class ViewPastIDPPage {
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // +selectIDP(idpId: Integer): void
    // UI event: the actor does "select idp" on the screen (gets: idpId)
    selectIDP(idpId) {
        // ask the controller for the IDP with this ID
        const idp = new ViewPastIDPController().viewIDP(idpId);
        // [IDP found and accessible]: it exists, belongs to this designer and is a past IDP
        const accessible = idp != null && idp.designerId === Session.userId
            // ...and it is a PAST IDP
            && idp.projectStatus === IDPStatus.PAST;
        // allowed -> show the IDP details
        if (accessible) this.displayIDPDetails(idp);
        else this.displayFailure();                      // [IDP not found / access denied]
    }

    // +displayIDPDetails(idp: IDP): void
    // BCE method: show the IDP details (a copy)
    displayIDPDetails(idp) { this.#show('data', 'IDP details', { ...idp }); }

    // +displayFailure(): void
    // BCE method: show the failure message "IDP not found or cannot be accessed"
    displayFailure() { this.#show('failure', 'IDP not found or cannot be accessed'); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[ViewPastIDPPage] ${message ?? ''}`, data ?? '');
    }
}
