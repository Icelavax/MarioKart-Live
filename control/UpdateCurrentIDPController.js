import IDP from '../entity/IDP.js';

// <<Control>> UpdateCurrentIDPController - US22 Update Current IDP
export default class UpdateCurrentIDPController {
    // +updateIDP(idpId: Integer, title: String, description: String, designStyle: String, categoryId: Integer): Boolean
    updateIDP(idpId, title, description, designStyle, categoryId) {
        return new IDP().updateIDP(idpId, title, description, designStyle, categoryId);
    }
}
