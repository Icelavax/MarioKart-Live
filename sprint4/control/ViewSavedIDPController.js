// ==========================================================================
// PRESENTATION NOTE
// US34 View Saved IDP - <<Control>> ViewSavedIDPController
//
// What to say: The controller has one job: it takes the request from the boundary page and passes
//              it to SavedIDP.viewSavedIDP(), then hands the answer back. It has no screen and
//              holds no data.
//
// Q: Why have a controller if it only passes the call on?
// A: It keeps the screen and the data apart: the boundary never touches the entity directly. If
//    the business logic changes, only the controller and entity change, not the UI. That is the
//    BCE rule.
// ==========================================================================

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
