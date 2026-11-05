import DeletePastIDPController from '../control/DeletePastIDPController.js';
import ViewPastIDPController from '../control/ViewPastIDPController.js';
import { IDPStatus } from '../entity/IDP.js';
import { Session } from './Session.js';
import { isPositiveInteger } from './Validator.js';

// <<Boundary>> DeletePastIDPPage - US28 Delete Past IDP
// Sequence: selectIDP(idpId) -> displayDeleteConfirmation(idp) -> confirmDeletion() -> deleteIDP(idpId)
export default class DeletePastIDPPage {
    idp = null;
    confirmationOpen = false;
    #confirmed = false;
    output = null;

    // +selectIDP(idpId: Integer): void
    selectIDP(idpId) {
        // The system retrieves the selected IDP (re-uses the US26 controller). Only the designer's own PAST IDP.
        const idp = isPositiveInteger(idpId) ? new ViewPastIDPController().viewIDP(idpId) : null;
        if (idp == null || idp.designerId !== Session.userId || idp.projectStatus !== IDPStatus.PAST) {
            this.displayFailure();                                       // [IDP not found / inaccessible]
            return;
        }
        this.idp = idp;
        this.displayDeleteConfirmation(idp);
    }

    // ---- UI events (actor arrows in the sequence diagram; not BCE methods) ----
    // Designer confirms the deletion ("Yes")
    clickYes() {
        if (!this.confirmationOpen) return;
        this.confirmationOpen = false;
        this.#confirmed = true;
        if (!this.confirmDeletion()) return;
        const success = new DeletePastIDPController().deleteIDP(this.idp.idpId);
        if (success === true) this.displaySuccess();      // [success = true]
        else this.displayFailure();                       // [success = false]
    }
    // Designer cancels the deletion ("No") - nothing is deleted, back to the previous page (A2)
    clickNo() {
        this.confirmationOpen = false;
        this.#confirmed = false;
        this.#show('message', 'Deletion cancelled');
    }

    // ---- BCE methods ----
    // +displayDeleteConfirmation(idp: IDP): void
    displayDeleteConfirmation(idp) {
        this.confirmationOpen = true;
        this.#show('confirm', `Delete "${idp.title}"? This cannot be undone.`, { ...idp });
    }

    // +confirmDeletion(): Boolean   - true once the designer has confirmed
    confirmDeletion() { return this.#confirmed; }

    // +displaySuccess(): void
    displaySuccess() { this.#show('success', 'Past IDP deleted'); }

    // +displayFailure(): void
    displayFailure() { this.#show('failure', 'Unable to delete IDP - please try again'); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[DeletePastIDPPage] ${message ?? ''}`, data ?? '');
    }
}
