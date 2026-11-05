import ViewIDPViewsController from '../control/ViewIDPViewsController.js';

// <<Boundary>> ViewIDPViewsPage - US37 View IDP Views
export default class ViewIDPViewsPage {
    output = null;

    // +selectIDP(idpId: Integer): void
    selectIDP(idpId) {
        const viewCount = new ViewIDPViewsController().getViewCount(idpId);
        if (viewCount >= 0) this.displayViewCount(viewCount);            // [Integer >= 0]
        else this.displayMessage('Unable to retrieve views');            // [Integer < 0]
    }

    // +displayViewCount(viewCount: Integer): void
    displayViewCount(viewCount) { this.#show('data', `Views: ${viewCount}`, viewCount); }

    // +displayMessage(message: String): void
    displayMessage(message) { this.#show('error', message); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[ViewIDPViewsPage] ${message ?? ''}`, data ?? '');
    }
}
