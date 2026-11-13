// ==========================================================================
// PRESENTATION NOTE
// US37 View IDP Views - <<Control>> ViewIDPViewsController
//
// What to say: The controller has one job: it takes the request from the boundary page and passes
//              it to IDPViewRecord.getViewCount(), then hands the answer back. It has no screen
//              and holds no data.
//
// Q: Why have a controller if it only passes the call on?
// A: It keeps the screen and the data apart: the boundary never touches the entity directly. If
//    the business logic changes, only the controller and entity change, not the UI. That is the
//    BCE rule.
// ==========================================================================

// bring in the IDPViewRecord entity class (it holds and checks the idp view record data)
import IDPViewRecord from '../entity/IDPViewRecord.js';

// <<Control>> ViewIDPViewsController - US37 View IDP Views
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class ViewIDPViewsController {
    // +getViewCount(idpId: Integer): Integer
    // BCE method getViewCount() (gets: idpId): called by the page
    getViewCount(idpId) {
        // create a IDPViewRecord entity and ask it to get view count with idpId; hand its answer back to the page
        return new IDPViewRecord().getViewCount(idpId);
    }
}
