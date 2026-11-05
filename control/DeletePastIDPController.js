import IDP from '../entity/IDP.js';

// <<Control>> DeletePastIDPController - US28 Delete Past IDP
export default class DeletePastIDPController {
    // +deleteIDP(idpId: Integer): Boolean
    deleteIDP(idpId) {
        return new IDP().deleteIDP(idpId);
    }
}
