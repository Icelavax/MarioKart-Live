// bring in the SavedIDP entity class (it holds and checks the saved idp data)
import SavedIDP from '../entity/SavedIDP.js';

// <<Control>> ViewSavedIDPController - US34 View Saved IDP (BCE spells it "viewSavedIDPController")
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class ViewSavedIDPController {
    // +viewSavedIDP(customerId: Integer, idpId: Integer): IDP
    // BCE method viewSavedIDP() (gets: customerId, idpId): called by the page
    viewSavedIDP(customerId, idpId) {
        // create a SavedIDP entity and ask it to view saved idp with customerId, idpId; hand its answer back to the page
        return new SavedIDP().viewSavedIDP(customerId, idpId);
    }
}
