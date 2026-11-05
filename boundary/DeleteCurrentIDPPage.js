import DeleteCurrentIDPController from '../control/DeleteCurrentIDPController.js';
import ViewCurrentIDPController from '../control/ViewCurrentIDPController.js';
import { IDPStatus } from '../entity/IDP.js';
import { Session } from './Session.js';
import { isPositiveInteger } from './Validator.js';

// <<Boundary>> DeleteCurrentIDPPage - US23 Delete Current IDP
// Sequence: selectIDP(idpId) -> displayDeleteConfirmation() -> confirmDeletion() -> deleteIDP(idpId)
export default class DeleteCurrentIDPPage {
    idpId = null;
    confirmationOpen = false;
    #confirmed = false;
    output = null;

    // +selectIDP(idpId: Integer): void
    selectIDP(idpId) {
        // Only the designer's own CURRENT IDP can be deleted here (lookup re-uses the US21 controller)
        const idp = isPositiveInteger(idpId) ? new ViewCurrentIDPController().viewIDP(idpId) : null;
        if (idp == null || idp.designerId !== Session.userId || idp.projectStatus !== IDPStatus.CURRENT) {
            this.displayFailure();
            return;
        }
        this.idpId = idpId;
        this.displayDeleteConfirmation();
    }

    // ---- UI events (actor arrows in the sequence diagram; not BCE methods) ----
    // Designer clicks "Yes" (confirms)
    clickYes() {
        if (!this.confirmationOpen) return;
        this.confirmationOpen = false;
        this.#confirmed = true;
        if (!this.confirmDeletion()) return;
        const success = new DeleteCurrentIDPController().deleteIDP(this.idpId);
        if (success === true) this.displaySuccess();      // [success = true]
        else this.displayFailure();                       // [success = false]
    }
    // Designer clicks "No" (cancels) - nothing is deleted
    clickNo() {
        this.confirmationOpen = false;
        this.#confirmed = false;
        this.#show('message', 'Deletion cancelled');
    }

    // ---- BCE methods ----
    // +displayDeleteConfirmation(): void
    displayDeleteConfirmation() {
        this.confirmationOpen = true;
        this.#show('confirm', 'Delete this IDP? This cannot be undone.');
    }

    // +confirmDeletion(): Boolean   - true once the designer has confirmed
    confirmDeletion() { return this.#confirmed; }

    // +displaySuccess(): void
    displaySuccess() { this.#show('success', 'IDP deleted'); }

    // +displayFailure(): void
    displayFailure() { this.#show('failure', 'Unable to delete IDP'); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[DeleteCurrentIDPPage] ${message ?? ''}`, data ?? '');
    }
}
