import ViewSavedIDPController from '../control/ViewSavedIDPController.js';
import { Session } from './Session.js';
import { isPositiveInteger } from './Validator.js';

// <<Boundary>> ViewSavedIDPPage - US34 View Saved IDP
export default class ViewSavedIDPPage {
    output = null;

    // +viewSavedIDP(idpId: Integer): void   - customer selects a saved IDP, clicks "View"
    viewSavedIDP(idpId) {
        const idp = isPositiveInteger(idpId)
            ? new ViewSavedIDPController().viewSavedIDP(Session.userId, idpId) : null;
        if (idp != null) this.displayIDP(idp);         // idp != null
        else this.displayError('IDP not found');      // idp == null
    }

    // +displayIDP(idp: IDP): void
    displayIDP(idp) { this.#show('data', 'Saved IDP details', { ...idp }); }

    // +displayError(message: String): void
    displayError(message) { this.#show('error', message); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[ViewSavedIDPPage] ${message ?? ''}`, data ?? '');
    }
}
