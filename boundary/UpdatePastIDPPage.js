// bring in UpdatePastIDPController - this page passes the user's request to it
import UpdatePastIDPController from '../control/UpdatePastIDPController.js';
// bring in ViewPastIDPController - this page passes the user's request to it
import ViewPastIDPController from '../control/ViewPastIDPController.js';
// bring in IDPStatus from the IDP entity file
import { IDPStatus } from '../entity/IDP.js';
// bring in Session - who is logged in and which role they have
import { Session } from './Session.js';
// bring in the shared field-check helpers we need: isFilled, isPositiveInteger
import { isFilled, isPositiveInteger } from './Validator.js';

// <<Boundary>> UpdatePastIDPPage - US27 Update Past IDP
// Sequence: selectIDP(idpId) -> displayUpdateForm(idp) -> captureUpdatedDetails() -> updateIDP()
export default class UpdatePastIDPPage {
    form = { title: '', description: '', designStyle: '', categoryId: null };   // the edit fields
    // the IDP picked for deleting (none yet)
    idp = null;
    // private copy of the details captured from the form
    #details = null;
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // +selectIDP(idpId: Integer): void
    // UI event: the actor does "select idp" on the screen (gets: idpId)
    selectIDP(idpId) {
        // Look the IDP up to fill the form (re-uses the view controller; not drawn in this diagram)
        const idp = isPositiveInteger(idpId) ? new ViewPastIDPController().viewIDP(idpId) : null;
        // not found, not this designer's IDP, or not a PAST IDP ->
        if (idp == null || idp.designerId !== Session.userId || idp.projectStatus !== IDPStatus.PAST) {
            // BCE method: show the failure message
            this.displayFailure();
            // stop here
            return;
        }
        // remember the IDP that was picked
        this.idp = idp;
        // show the update form for this IDP
        this.displayUpdateForm(idp);
    }

    // UI event: designer edits the details and clicks "Save Changes"
    clickSaveChanges() {
        // no IDP picked -> show the failure message and stop
        if (this.idp == null) { this.displayFailure(); return; }
        // copy what was typed into the form
        this.captureUpdatedDetails();
        // check the input; if something is missing, show the failure message and stop
        if (!this.#validateInput()) { this.displayFailure(); return; }
        // short name for the captured details
        const d = this.#details;
        // input OK -> ask the controller to update this IDP with the trimmed title and description...
        const success = new UpdatePastIDPController().updateIDP(this.idp.idpId, d.title.trim(), d.description.trim(),
            // ...the trimmed design style and the chosen category
            (d.designStyle ?? '').trim(), d.categoryId);
        if (success === true) this.displaySuccess();      // [success = true]
        else this.displayFailure();                       // [success = false]
    }

    // +displayUpdateForm(idp: IDP): void
    // BCE method displayUpdateForm() (gets: idp)
    displayUpdateForm(idp) {
        // fill the form with the IDP's current values
        this.form = { title: idp.title, description: idp.description, designStyle: idp.designStyle, categoryId: idp.categoryId };
        // show the update form
        this.#show('form', 'Update IDP form', { ...idp });
    }

    // +captureUpdatedDetails(): void
    // BCE method: copy the form values into #details
    captureUpdatedDetails() { this.#details = { ...this.form }; }

    // Field validation (boundary). Not in the BCE diagram, so it is private.
    #validateInput() {
        // short name for the captured details
        const d = this.#details;
        // valid only if: details captured, title and description not blank, and a category picked
        return d != null && isFilled(d.title) && isFilled(d.description) && isPositiveInteger(d.categoryId);
    }

    // +displaySuccess(): void
    // BCE method: show the success message "IDP updated"
    displaySuccess() { this.#show('success', 'IDP updated'); }

    // +displayFailure(): void
    // BCE method: show the failure message "Unable to update IDP - please correct the details and retry"
    displayFailure() { this.#show('failure', 'Unable to update IDP - please correct the details and retry'); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[UpdatePastIDPPage] ${message ?? ''}`, data ?? '');
    }
}
