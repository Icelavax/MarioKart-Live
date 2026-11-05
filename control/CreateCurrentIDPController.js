// bring in the IDP entity class (it holds and checks the idp data)
import IDP from '../entity/IDP.js';

// <<Control>> CreateCurrentIDPController - US20 Create Current IDP
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class CreateCurrentIDPController {
    // +createIDP(designerId: Integer, categoryId: Integer, title: String, description: String): Boolean
    // BCE method createIDP() (gets: designerId, categoryId, title, description): called by the page
    createIDP(designerId, categoryId, title, description) {
        // create a IDP entity and ask it to create idp with designerId, categoryId, title, description; hand its answer back to the page
        return new IDP().createIDP(designerId, categoryId, title, description);
    }
}
