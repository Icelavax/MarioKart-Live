// ==========================================================================
// PRESENTATION NOTE
// US38 View IDP Shortlists - <<Control>> ViewIDPShortlistsController
//
// What to say: The controller has one job: it takes the request from the boundary page and passes
//              it to IDP.getShortlistCount(), then hands the answer back. It has no screen and
//              holds no data.
//
// Q: Why have a controller if it only passes the call on?
// A: It keeps the screen and the data apart: the boundary never touches the entity directly. If
//    the business logic changes, only the controller and entity change, not the UI. That is the
//    BCE rule.
// ==========================================================================

// bring in the IDP entity class (it holds and checks the idp data)
import IDP from '../entity/IDP.js';

// <<Control>> ViewIDPShortlistsController - US38 View IDP Shortlists
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class ViewIDPShortlistsController {
    // +getShortlistCount(idpID: int): int
    // BCE method getShortlistCount() (gets: idpID): called by the page
    getShortlistCount(idpID) {
        // create a IDP entity and ask it to get shortlist count with idpID; hand its answer back to the page
        return new IDP().getShortlistCount(idpID);
    }
}
