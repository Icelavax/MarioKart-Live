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
