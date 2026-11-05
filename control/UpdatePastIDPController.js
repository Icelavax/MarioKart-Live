import IDP from '../entity/IDP.js';

// <<Control>> UpdatePastIDPController - US27 Update Past IDP
export default class UpdatePastIDPController {
    // +updateIDP(idpId: Integer, title: String, description: String, designStyle: String, categoryId: Integer): Boolean
    updateIDP(idpId, title, description, designStyle, categoryId) {
        return new IDP().updateIDP(idpId, title, description, designStyle, categoryId);
    }
}
