import UpdatePastIDPController from '../control/UpdatePastIDPController.js';
import ViewPastIDPController from '../control/ViewPastIDPController.js';
import { IDPStatus } from '../entity/IDP.js';
import { Session } from './Session.js';
import { isFilled, isPositiveInteger } from './Validator.js';

// <<Boundary>> UpdatePastIDPPage - US27 Update Past IDP
// Sequence: selectIDP(idpId) -> displayUpdateForm(idp) -> captureUpdatedDetails() -> updateIDP()
export default class UpdatePastIDPPage {
    form = { title: '', description: '', designStyle: '', categoryId: null };   // the edit fields
    idp = null;
    #details = null;
    output = null;

    // +selectIDP(idpId: Integer): void
    selectIDP(idpId) {
        // Look the IDP up to fill the form (re-uses the view controller; not drawn in this diagram)
        const idp = isPositiveInteger(idpId) ? new ViewPastIDPController().viewIDP(idpId) : null;
        if (idp == null || idp.designerId !== Session.userId || idp.projectStatus !== IDPStatus.PAST) {
            this.displayFailure();
            return;
        }
        this.idp = idp;
        this.displayUpdateForm(idp);
    }

    // UI event: designer edits the details and clicks "Save Changes"
    clickSaveChanges() {
        if (this.idp == null) { this.displayFailure(); return; }
        this.captureUpdatedDetails();
        if (!this.#validateInput()) { this.displayFailure(); return; }
        const d = this.#details;
        const success = new UpdatePastIDPController().updateIDP(this.idp.idpId, d.title.trim(), d.description.trim(),
            (d.designStyle ?? '').trim(), d.categoryId);
        if (success === true) this.displaySuccess();      // [success = true]
        else this.displayFailure();                       // [success = false]
    }

    // +displayUpdateForm(idp: IDP): void
    displayUpdateForm(idp) {
        this.form = { title: idp.title, description: idp.description, designStyle: idp.designStyle, categoryId: idp.categoryId };
        this.#show('form', 'Update IDP form', { ...idp });
    }

    // +captureUpdatedDetails(): void
    captureUpdatedDetails() { this.#details = { ...this.form }; }

    // Field validation (boundary). Not in the BCE diagram, so it is private.
    #validateInput() {
        const d = this.#details;
        return d != null && isFilled(d.title) && isFilled(d.description) && isPositiveInteger(d.categoryId);
    }

    // +displaySuccess(): void
    displaySuccess() { this.#show('success', 'IDP updated'); }

    // +displayFailure(): void
    displayFailure() { this.#show('failure', 'Unable to update IDP - please correct the details and retry'); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[UpdatePastIDPPage] ${message ?? ''}`, data ?? '');
    }
}
