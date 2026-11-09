// bring in the SavedIDP entity class (it holds and checks the saved idp data)
import SavedIDP from '../entity/SavedIDP.js';

// <<Control>> SaveIDPController - US32 Save IDP
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class SaveIDPController {
    // +saveIDP(customerId: Integer, idpId: Integer): Boolean
    // BCE method saveIDP() (gets: customerId, idpId): called by the page
    saveIDP(customerId, idpId) {
        // create a SavedIDP entity and ask it to save idp with customerId, idpId; hand its answer back to the page
        return new SavedIDP().saveIDP(customerId, idpId);
    }
}
