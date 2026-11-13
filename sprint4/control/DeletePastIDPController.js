// ==========================================================================
// PRESENTATION NOTE
// US28 Delete Past IDP - <<Control>> DeletePastIDPController
//
// What to say: The controller has one job: it takes the request from the boundary page and passes
//              it to IDP.deleteIDP(), then hands the answer back. It has no screen and holds no
//              data.
//
// Q: Why have a controller if it only passes the call on?
// A: It keeps the screen and the data apart: the boundary never touches the entity directly. If
//    the business logic changes, only the controller and entity change, not the UI. That is the
//    BCE rule.
// ==========================================================================

// bring in the IDP entity class (it holds and checks the idp data)
import IDP from '../entity/IDP.js';

// <<Control>> DeletePastIDPController - US28 Delete Past IDP
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class DeletePastIDPController {
    // +deleteIDP(idpId: Integer): Boolean
    // BCE method deleteIDP() (gets: idpId): called by the page
    deleteIDP(idpId) {
        // create a IDP entity and ask it to delete idp with idpId; hand its answer back to the page
        return new IDP().deleteIDP(idpId);
    }
}
