import IDP from '../entity/IDP.js';

// <<Control>> ViewCurrentIDPController - US21 View Current IDP
export default class ViewCurrentIDPController {
    // +viewIDP(idpId: Integer): IDP
    viewIDP(idpId) {
        return new IDP().viewIDP(idpId);
    }
}
