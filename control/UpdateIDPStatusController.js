import IDP from '../entity/IDP.js';

// <<Control>> UpdateIDPStatusController - US25 Update IDP Status
export default class UpdateIDPStatusController {
    // +updateIDPStatus(idpId: Integer, status: String): Boolean
    updateIDPStatus(idpId, status) {
        return new IDP().updateIDPStatus(idpId, status);
    }
}
