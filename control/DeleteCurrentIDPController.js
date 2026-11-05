// bring in the IDP entity class (it holds and checks the idp data)
import IDP from '../entity/IDP.js';

// <<Control>> DeleteCurrentIDPController - US23 Delete Current IDP
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class DeleteCurrentIDPController {
    // +deleteIDP(idpId: Integer): Boolean
    // BCE method deleteIDP() (gets: idpId): called by the page
    deleteIDP(idpId) {
        // create a IDP entity and ask it to delete idp with idpId; hand its answer back to the page
        return new IDP().deleteIDP(idpId);
    }
}
