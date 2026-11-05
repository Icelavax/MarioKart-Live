// bring in the IDP entity class (it holds and checks the idp data)
import IDP from '../entity/IDP.js';

// <<Control>> UpdatePastIDPController - US27 Update Past IDP
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class UpdatePastIDPController {
    // +updateIDP(idpId: Integer, title: String, description: String, designStyle: String, categoryId: Integer): Boolean
    // BCE method updateIDP() (gets: idpId, title, description, designStyle, categoryId): called by the page
    updateIDP(idpId, title, description, designStyle, categoryId) {
        // create a IDP entity and ask it to update idp with idpId, title, description, designStyle, categoryId; hand its answer back to the page
        return new IDP().updateIDP(idpId, title, description, designStyle, categoryId);
    }
}
