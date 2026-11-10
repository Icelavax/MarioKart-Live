// bring in ViewIDPViewsController - this page passes the user's request to it
import ViewIDPViewsController from '../control/ViewIDPViewsController.js';

// <<Boundary>> ViewIDPViewsPage - US37 View IDP Views
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class ViewIDPViewsPage {
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // +selectIDP(idpId: Integer): void
    // UI event: the actor does "select idp" on the screen (gets: idpId)
    selectIDP(idpId) {
        // ask the controller how many times this IDP was viewed
        const viewCount = new ViewIDPViewsController().getViewCount(idpId);
        if (viewCount >= 0) this.displayViewCount(viewCount);            // [Integer >= 0]
        else this.displayMessage('Unable to retrieve views');            // [Integer < 0]
    }

    // +displayViewCount(viewCount: Integer): void
    // BCE method: show the view count, e.g. "Views: 12"
    displayViewCount(viewCount) { this.#show('data', `Views: ${viewCount}`, viewCount); }

    // +displayMessage(message: String): void
    // BCE method: show the error message that was passed in (message)
    displayMessage(message) { this.#show('error', message); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[ViewIDPViewsPage] ${message ?? ''}`, data ?? '');
    }
}
