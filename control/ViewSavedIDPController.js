import SavedIDP from '../entity/SavedIDP.js';

// <<Control>> ViewSavedIDPController - US34 View Saved IDP (BCE spells it "viewSavedIDPController")
export default class ViewSavedIDPController {
    // +viewSavedIDP(customerId: Integer, idpId: Integer): IDP
    viewSavedIDP(customerId, idpId) {
        return new SavedIDP().viewSavedIDP(customerId, idpId);
    }
}
