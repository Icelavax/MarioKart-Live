import IDPViewRecord from '../entity/IDPViewRecord.js';

// <<Control>> ViewIDPViewsController - US37 View IDP Views
export default class ViewIDPViewsController {
    // +getViewCount(idpId: Integer): Integer
    getViewCount(idpId) {
        return new IDPViewRecord().getViewCount(idpId);
    }
}
