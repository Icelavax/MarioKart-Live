import IDP from '../entity/IDP.js';

// <<Control>> CreateCurrentIDPController - US20 Create Current IDP
export default class CreateCurrentIDPController {
    // +createIDP(designerId: Integer, categoryId: Integer, title: String, description: String): Boolean
    createIDP(designerId, categoryId, title, description) {
        return new IDP().createIDP(designerId, categoryId, title, description);
    }
}
