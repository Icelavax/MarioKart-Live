// bring in UpdateIDPStatusController - this page passes the user's request to it
import UpdateIDPStatusController from '../control/UpdateIDPStatusController.js';
// bring in ViewCurrentIDPController - this page passes the user's request to it
import ViewCurrentIDPController from '../control/ViewCurrentIDPController.js';
// bring in IDPStatus from the IDP entity file
import { IDPStatus } from '../entity/IDP.js';
// bring in Session - who is logged in and which role they have
import { Session } from './Session.js';
// bring in the shared field-check helpers we need: isPositiveInteger
import { isPositiveInteger } from './Validator.js';

// <<Boundary>> UpdateIDPStatusPage - US25 Update IDP Status
// Sequence: selectIDP(idpId) -> displayUpdateStatusForm() -> captureUpdatedDetails() -> updateIDPStatus()
export default class UpdateIDPStatusPage {
    form = { status: IDPStatus.PAST };   // stand-in for the "new status" input
    idp = null;                          // the selected IDP
    // private copy of the details captured from the form
    #details = null;
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // +selectIDP(idpId: Integer): void
    // UI event: the actor does "select idp" on the screen (gets: idpId)
    selectIDP(idpId) {
        // Look the IDP up to show the form (re-uses the US21 controller; not drawn in this diagram)
        const idp = isPositiveInteger(idpId) ? new ViewCurrentIDPController().viewIDP(idpId) : null;
        // not found, not this designer's IDP, or not a CURRENT IDP ->
        if (idp == null || idp.designerId !== Session.userId || idp.projectStatus !== IDPStatus.CURRENT) {
            this.displayFailure();                                    // [IDP not found / inaccessible]
            // stop here
            return;
        }
        // remember the IDP that was picked
        this.idp = idp;
        // show the "update status" form
        this.displayUpdateStatusForm();
    }

    // UI event: designer picks the new status and clicks "Update Status"
    clickUpdateStatus() {
        // no IDP picked -> show the failure message and stop
        if (this.idp == null) { this.displayFailure(); return; }
        // copy what was typed into the form
        this.captureUpdatedDetails();
        if (!Object.values(IDPStatus).includes(this.#details.status)) {    // field validation (boundary)
            // the status is not Current or Past -> show this message
            this.#show('failure', 'Please choose a valid status');
            // stop here
            return;
        }
        // ask the controller to change this IDP's status to the picked one
        const success = new UpdateIDPStatusController().updateIDPStatus(this.idp.idpId, this.#details.status);
        if (success === true) this.displaySuccess();                 // [success = true]
        else this.displayFailure();                                  // [success = false]
    }

    // +displayUpdateStatusForm(): void
    // BCE method: show the "update status" form for this IDP
    displayUpdateStatusForm() { this.#show('form', 'Update IDP status form', { ...this.idp }); }

    // +captureUpdatedDetails(): void
    // BCE method: copy the form values into #details
    captureUpdatedDetails() { this.#details = { ...this.form }; }

    // +displaySuccess(): void
    // BCE method: show the success message "IDP status updated"
    displaySuccess() { this.#show('success', 'IDP status updated'); }

    // +displayFailure(): void
    // BCE method: show the failure message "Unable to update IDP status"
    displayFailure() { this.#show('failure', 'Unable to update IDP status'); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[UpdateIDPStatusPage] ${message ?? ''}`, data ?? '');
    }
}
