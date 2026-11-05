import UpdateIDPStatusController from '../control/UpdateIDPStatusController.js';
import ViewCurrentIDPController from '../control/ViewCurrentIDPController.js';
import { IDPStatus } from '../entity/IDP.js';
import { Session } from './Session.js';
import { isPositiveInteger } from './Validator.js';

// <<Boundary>> UpdateIDPStatusPage - US25 Update IDP Status
// Sequence: selectIDP(idpId) -> displayUpdateStatusForm() -> captureUpdatedDetails() -> updateIDPStatus()
export default class UpdateIDPStatusPage {
    form = { status: IDPStatus.PAST };   // stand-in for the "new status" input
    idp = null;                          // the selected IDP
    #details = null;
    output = null;

    // +selectIDP(idpId: Integer): void
    selectIDP(idpId) {
        // Look the IDP up to show the form (re-uses the US21 controller; not drawn in this diagram)
        const idp = isPositiveInteger(idpId) ? new ViewCurrentIDPController().viewIDP(idpId) : null;
        if (idp == null || idp.designerId !== Session.userId || idp.projectStatus !== IDPStatus.CURRENT) {
            this.displayFailure();                                    // [IDP not found / inaccessible]
            return;
        }
        this.idp = idp;
        this.displayUpdateStatusForm();
    }

    // UI event: designer picks the new status and clicks "Update Status"
    clickUpdateStatus() {
        if (this.idp == null) { this.displayFailure(); return; }
        this.captureUpdatedDetails();
        if (!Object.values(IDPStatus).includes(this.#details.status)) {    // field validation (boundary)
            this.#show('failure', 'Please choose a valid status');
            return;
        }
        const success = new UpdateIDPStatusController().updateIDPStatus(this.idp.idpId, this.#details.status);
        if (success === true) this.displaySuccess();                 // [success = true]
        else this.displayFailure();                                  // [success = false]
    }

    // +displayUpdateStatusForm(): void
    displayUpdateStatusForm() { this.#show('form', 'Update IDP status form', { ...this.idp }); }

    // +captureUpdatedDetails(): void
    captureUpdatedDetails() { this.#details = { ...this.form }; }

    // +displaySuccess(): void
    displaySuccess() { this.#show('success', 'IDP status updated'); }

    // +displayFailure(): void
    displayFailure() { this.#show('failure', 'Unable to update IDP status'); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[UpdateIDPStatusPage] ${message ?? ''}`, data ?? '');
    }
}
