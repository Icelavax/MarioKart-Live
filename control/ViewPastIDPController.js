// bring in the IDP entity class (it holds and checks the idp data)
import IDP from '../entity/IDP.js';

// <<Control>> ViewPastIDPController - US26 View Past IDP
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class ViewPastIDPController {
    // +viewIDP(idpId: Integer): IDP
    // BCE method viewIDP() (gets: idpId): called by the page
    viewIDP(idpId) {
        // create a IDP entity and ask it to view idp with idpId; hand its answer back to the page
        return new IDP().viewIDP(idpId);
    }
}
