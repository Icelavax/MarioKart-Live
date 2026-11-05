import SavedIDP from '../entity/SavedIDP.js';

// <<Control>> SaveIDPController - US32 Save IDP
export default class SaveIDPController {
    // +saveIDP(customerId: Integer, idpId: Integer): Boolean
    saveIDP(customerId, idpId) {
        return new SavedIDP().saveIDP(customerId, idpId);
    }
}
