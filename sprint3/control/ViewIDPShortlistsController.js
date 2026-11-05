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
