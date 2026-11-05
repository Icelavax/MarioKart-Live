import IDP from '../entity/IDP.js';

// <<Control>> ViewPastIDPController - US26 View Past IDP
export default class ViewPastIDPController {
    // +viewIDP(idpId: Integer): IDP
    viewIDP(idpId) {
        return new IDP().viewIDP(idpId);
    }
}
