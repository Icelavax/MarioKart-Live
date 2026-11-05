import SaveIDPController from '../control/SaveIDPController.js';
import { Session } from './Session.js';
import { isPositiveInteger } from './Validator.js';

// <<Boundary>> SaveIDPPage - US32 Save IDP
export default class SaveIDPPage {
    output = null;

    // +selectSave(idpId: Integer): void   - customer clicks "Save" on the IDP being viewed
    selectSave(idpId) {
        if (!isPositiveInteger(idpId)) { this.displayError('IDP not found'); return; }    // boundary
        const success = new SaveIDPController().saveIDP(Session.userId, idpId);
        if (success === true) this.displaySuccess('IDP saved');            // [IDP saved successfully]
        else this.displayError('IDP already saved');                      // [IDP already saved]
    }

    // +displaySuccess(message: String): void
    displaySuccess(message) { this.#show('success', message); }

    // +displayError(message: String): void
    displayError(message) { this.#show('error', message); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[SaveIDPPage] ${message ?? ''}`, data ?? '');
    }
}
