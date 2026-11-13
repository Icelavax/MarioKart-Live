// ==========================================================================
// PRESENTATION NOTE
// US33 Search Saved IDP - <<Control>> SearchSavedIDPController
//
// What to say: The controller has one job: it takes the request from the boundary page and passes
//              it to SavedIDP.searchSavedIDP(), then hands the answer back. It has no screen and
//              holds no data.
//
// Q: Why have a controller if it only passes the call on?
// A: It keeps the screen and the data apart: the boundary never touches the entity directly. If
//    the business logic changes, only the controller and entity change, not the UI. That is the
//    BCE rule.
// ==========================================================================

// bring in the SavedIDP entity class (it holds and checks the saved idp data)
import SavedIDP from '../entity/SavedIDP.js';

// <<Control>> SearchSavedIDPController - US33 Search Saved IDP
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class SearchSavedIDPController {
    // +searchSavedIDP(customerId: Integer, title: String): List<IDP>
    // BCE method searchSavedIDP() (gets: customerId, title): called by the page
    searchSavedIDP(customerId, title) {
        // create a SavedIDP entity and ask it to search saved idp with customerId, title; hand its answer back to the page
        return new SavedIDP().searchSavedIDP(customerId, title);
    }
}
