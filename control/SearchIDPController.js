import IDP from '../entity/IDP.js';

// <<Control>> SearchIDPController - US30 Search IDP
export default class SearchIDPController {
    // +searchIDP(criteria: String): IDP[]
    searchIDP(criteria) {
        return new IDP().searchIDP(criteria);
    }
}
