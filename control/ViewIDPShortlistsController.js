import IDP from '../entity/IDP.js';

// <<Control>> ViewIDPShortlistsController - US38 View IDP Shortlists
export default class ViewIDPShortlistsController {
    // +getShortlistCount(idpID: int): int
    getShortlistCount(idpID) {
        return new IDP().getShortlistCount(idpID);
    }
}
