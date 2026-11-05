import SavedIDP from '../entity/SavedIDP.js';

// <<Control>> SearchSavedIDPController - US33 Search Saved IDP
export default class SearchSavedIDPController {
    // +searchSavedIDP(customerId: Integer, title: String): List<IDP>
    searchSavedIDP(customerId, title) {
        return new SavedIDP().searchSavedIDP(customerId, title);
    }
}
