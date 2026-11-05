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
