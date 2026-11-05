import ViewIDPController from '../control/ViewIDPController.js';

// <<Boundary>> ViewIDPPage - US31 View IDP
export default class ViewIDPPage {
    output = null;

    // +selectIDP(idpId: Integer): void
    selectIDP(idpId) {
        const idp = new ViewIDPController().viewIDP(idpId);
        if (idp != null) this.displayIDPDetails(idp);    // [IDP found]
        else this.displayError('IDP not found');         // [IDP not found]
    }

    // +displayIDPDetails(idp: IDP): void
    displayIDPDetails(idp) { this.#show('data', 'IDP details', { ...idp }); }

    // +displayError(message: String): void
    displayError(message) { this.#show('error', message); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[ViewIDPPage] ${message ?? ''}`, data ?? '');
    }
}
