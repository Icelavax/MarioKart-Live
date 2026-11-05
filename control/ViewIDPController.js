import IDP from '../entity/IDP.js';

// <<Control>> ViewIDPController - US31 View IDP
export default class ViewIDPController {
    // +viewIDP(idpId: Integer): IDP
    viewIDP(idpId) {
        return new IDP().viewIDP(idpId);
    }
}
