// ==========================================================================
// PRESENTATION NOTE
// US21 View Current IDP - <<Control>> ViewCurrentIDPController
//
// What to say: The controller has one job: it takes the request from the boundary page and passes
//              it to IDP.viewIDP(), then hands the answer back. It has no screen and holds no
//              data.
//
// Q: Why have a controller if it only passes the call on?
// A: It keeps the screen and the data apart: the boundary never touches the entity directly. If
//    the business logic changes, only the controller and entity change, not the UI. That is the
//    BCE rule.
// ==========================================================================

// bring in the IDP entity class (it holds and checks the idp data)
import IDP from '../entity/IDP.js';

// <<Control>> ViewCurrentIDPController - US21 View Current IDP
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class ViewCurrentIDPController {
    // +viewIDP(idpId: Integer): IDP
    // BCE method viewIDP() (gets: idpId): called by the page
    viewIDP(idpId) {
        // create a IDP entity and ask it to view idp with idpId; hand its answer back to the page
        return new IDP().viewIDP(idpId);
    }
}
