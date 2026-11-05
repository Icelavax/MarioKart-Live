// bring in the IDP entity class (it holds and checks the idp data)
import IDP from '../entity/IDP.js';

// <<Control>> SearchIDPController - US30 Search IDP
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class SearchIDPController {
    // +searchIDP(criteria: String): IDP[]
    // BCE method searchIDP() (gets: criteria): called by the page
    searchIDP(criteria) {
        // create a IDP entity and ask it to search idp with criteria; hand its answer back to the page
        return new IDP().searchIDP(criteria);
    }
}
