// ==========================================================================
// PRESENTATION NOTE
// US25 Update IDP Status - <<Control>> UpdateIDPStatusController
//
// What to say: The controller has one job: it takes the request from the boundary page and passes
//              it to IDP.updateIDPStatus(), then hands the answer back. It has no screen and
//              holds no data.
//
// Q: Why have a controller if it only passes the call on?
// A: It keeps the screen and the data apart: the boundary never touches the entity directly. If
//    the business logic changes, only the controller and entity change, not the UI. That is the
//    BCE rule.
// ==========================================================================

// bring in the IDP entity class (it holds and checks the idp data)
import IDP from '../entity/IDP.js';

// <<Control>> UpdateIDPStatusController - US25 Update IDP Status
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class UpdateIDPStatusController {
    // +updateIDPStatus(idpId: Integer, status: String): Boolean
    // BCE method updateIDPStatus() (gets: idpId, status): called by the page
    updateIDPStatus(idpId, status) {
        // create a IDP entity and ask it to update idp status with idpId, status; hand its answer back to the page
        return new IDP().updateIDPStatus(idpId, status);
    }
}
