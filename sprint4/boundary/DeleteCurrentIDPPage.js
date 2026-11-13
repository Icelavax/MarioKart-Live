// ==========================================================================
// PRESENTATION NOTE
// US23 Delete Current IDP - <<Boundary>> DeleteCurrentIDPPage
//
// What to say: This is the screen for US23. It first checks the input with Validator.js (blank
//              fields, formats). Only if the input is valid does it call
//              ViewCurrentIDPController.viewIDP(), and then it shows the result with
//              displaySuccess() or displayError(), following the sequence diagram.
//
// Q: Why is field validation in the boundary and not in the entity?
// A: Bad input is stopped at the screen, so the controller and entity only ever receive clean
//    data. The entity only checks rules that need stored data (e.g. duplicates).
//
// Q: Is it really removed from the database?
// A: The entity removes it from its list after the Yes confirmation, and db.js saves the change
//    to Neon in one transaction (BEGIN/COMMIT).
// ==========================================================================

// bring in DeleteCurrentIDPController - this page passes the user's request to it
import DeleteCurrentIDPController from '../control/DeleteCurrentIDPController.js';
// bring in ViewCurrentIDPController - this page passes the user's request to it
import ViewCurrentIDPController from '../control/ViewCurrentIDPController.js';
// bring in IDPStatus from the IDP entity file
import { IDPStatus } from '../entity/IDP.js';
// bring in Session - who is logged in and which role they have
import { Session } from './Session.js';
// bring in the shared field-check helpers we need: isPositiveInteger
import { isPositiveInteger } from './Validator.js';

// <<Boundary>> DeleteCurrentIDPPage - US23 Delete Current IDP
// Sequence: selectIDP(idpId) -> displayDeleteConfirmation() -> confirmDeletion() -> deleteIDP(idpId)
export default class DeleteCurrentIDPPage {
    // the ID of the IDP picked for deleting (none yet)
    idpId = null;
    // is the Yes/No confirmation pop-up open? starts closed
    confirmationOpen = false;
    // private: has the actor clicked "Yes"?
    #confirmed = false;
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // +selectIDP(idpId: Integer): void
    // UI event: the actor does "select idp" on the screen (gets: idpId)
    selectIDP(idpId) {
        // Only the designer's own CURRENT IDP can be deleted here (lookup re-uses the US21 controller)
        const idp = isPositiveInteger(idpId) ? new ViewCurrentIDPController().viewIDP(idpId) : null;
        // not found, not this designer's IDP, or not a CURRENT IDP ->
        if (idp == null || idp.designerId !== Session.userId || idp.projectStatus !== IDPStatus.CURRENT) {
            // BCE method: show the failure message
            this.displayFailure();
            // stop here
            return;
        }
        // remember which IDP was picked
        this.idpId = idpId;
        // ask "Are you sure?"
        this.displayDeleteConfirmation();
    }

    // ---- UI events (actor arrows in the sequence diagram; not BCE methods) ----
    // Designer clicks "Yes" (confirms)
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
        const success = new DeleteCurrentIDPController().deleteIDP(this.idpId);
        if (success === true) this.displaySuccess();      // [success = true]
        else this.displayFailure();                       // [success = false]
    }
    // Designer clicks "No" (cancels) - nothing is deleted
    clickNo() {
        // mark the Yes/No pop-up as closed
        this.confirmationOpen = false;
        // reset the "confirmed" flag
        this.#confirmed = false;
        // show that nothing was deleted
        this.#show('message', 'Deletion cancelled');
    }

    // ---- BCE methods ----
    // +displayDeleteConfirmation(): void
    // BCE method displayDeleteConfirmation()
    displayDeleteConfirmation() {
        // mark the Yes/No pop-up as open
        this.confirmationOpen = true;
        // open the pop-up with this question
        this.#show('confirm', 'Delete this IDP? This cannot be undone.');
    }

    // +confirmDeletion(): Boolean   - true once the designer has confirmed
    // BCE method: true only if the actor clicked "Yes"
    confirmDeletion() { return this.#confirmed; }

    // +displaySuccess(): void
    // BCE method: show the success message "IDP deleted"
    displaySuccess() { this.#show('success', 'IDP deleted'); }

    // +displayFailure(): void
    // BCE method: show the failure message "Unable to delete IDP"
    displayFailure() { this.#show('failure', 'Unable to delete IDP'); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[DeleteCurrentIDPPage] ${message ?? ''}`, data ?? '');
    }
}
