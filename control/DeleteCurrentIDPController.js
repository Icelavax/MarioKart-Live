import IDP from '../entity/IDP.js';

// <<Control>> DeleteCurrentIDPController - US23 Delete Current IDP
export default class DeleteCurrentIDPController {
    // +deleteIDP(idpId: Integer): Boolean
    deleteIDP(idpId) {
        return new IDP().deleteIDP(idpId);
    }
}
