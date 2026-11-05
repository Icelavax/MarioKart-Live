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
