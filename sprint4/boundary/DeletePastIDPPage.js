// bring in DeletePastIDPController - this page passes the user's request to it
import DeletePastIDPController from '../control/DeletePastIDPController.js';
// bring in ViewPastIDPController - this page passes the user's request to it
import ViewPastIDPController from '../control/ViewPastIDPController.js';
// bring in IDPStatus from the IDP entity file
import { IDPStatus } from '../entity/IDP.js';
// bring in Session - who is logged in and which role they have
import { Session } from './Session.js';
// bring in the shared field-check helpers we need: isPositiveInteger
import { isPositiveInteger } from './Validator.js';

// <<Boundary>> DeletePastIDPPage - US28 Delete Past IDP
// Sequence: selectIDP(idpId) -> displayDeleteConfirmation(idp) -> confirmDeletion() -> deleteIDP(idpId)
export default class DeletePastIDPPage {
    // the IDP picked for deleting (none yet)
    idp = null;
    // is the Yes/No confirmation pop-up open? starts closed
    confirmationOpen = false;
    // private: has the actor clicked "Yes"?
    #confirmed = false;
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // +selectIDP(idpId: Integer): void
    // UI event: the actor does "select idp" on the screen (gets: idpId)
    selectIDP(idpId) {
        // The system retrieves the selected IDP (re-uses the US26 controller). Only the designer's own PAST IDP.
        const idp = isPositiveInteger(idpId) ? new ViewPastIDPController().viewIDP(idpId) : null;
        // not found, not this designer's IDP, or not a PAST IDP ->
        if (idp == null || idp.designerId !== Session.userId || idp.projectStatus !== IDPStatus.PAST) {
            this.displayFailure();                                       // [IDP not found / inaccessible]
            // stop here
            return;
        }
        // remember the IDP that was picked
        this.idp = idp;
        // ask "Are you sure?" and show which IDP it is
        this.displayDeleteConfirmation(idp);
    }

    // ---- UI events (actor arrows in the sequence diagram; not BCE methods) ----
    // Designer confirms the deletion ("Yes")
    clickYes() {
        // ignore the click if no confirmation pop-up is open
        if (!this.confirmationOpen) return;
        // mark the Yes/No pop-up as closed
        this.confirmationOpen = false;
        // actor clicked "Yes" -> remember that they confirmed
        this.#confirmed = true;
        // stop unless the deletion was confirmed
        if (!this.confirmDeletion()) return;
        // ask the controller to delete this IDP
        const success = new DeletePastIDPController().deleteIDP(this.idp.idpId);
        if (success === true) this.displaySuccess();      // [success = true]
        else this.displayFailure();                       // [success = false]
    }
    // Designer cancels the deletion ("No") - nothing is deleted, back to the previous page (A2)
    clickNo() {
        // mark the Yes/No pop-up as closed
        this.confirmationOpen = false;
        // reset the "confirmed" flag
        this.#confirmed = false;
        // show that nothing was deleted
        this.#show('message', 'Deletion cancelled');
    }

    // ---- BCE methods ----
    // +displayDeleteConfirmation(idp: IDP): void
    // BCE method displayDeleteConfirmation() (gets: idp)
    displayDeleteConfirmation(idp) {
        // mark the Yes/No pop-up as open
        this.confirmationOpen = true;
        // open the pop-up naming the IDP, e.g. Delete "Japanese Modern"?
        this.#show('confirm', `Delete "${idp.title}"? This cannot be undone.`, { ...idp });
    }

    // +confirmDeletion(): Boolean   - true once the designer has confirmed
    // BCE method: true only if the actor clicked "Yes"
    confirmDeletion() { return this.#confirmed; }

    // +displaySuccess(): void
    // BCE method: show the success message "Past IDP deleted"
    displaySuccess() { this.#show('success', 'Past IDP deleted'); }

    // +displayFailure(): void
    // BCE method: show the failure message "Unable to delete IDP - please try again"
    displayFailure() { this.#show('failure', 'Unable to delete IDP - please try again'); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[DeletePastIDPPage] ${message ?? ''}`, data ?? '');
    }
}
