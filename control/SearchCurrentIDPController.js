// bring in the IDP entity class (it holds and checks the idp data), plus IDPStatus
import IDP, { IDPStatus } from '../entity/IDP.js';

// <<Control>> SearchCurrentIDPController - US24 Search Current IDP
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class SearchCurrentIDPController {
    // +searchIDP(keyword: String, categoryId: Integer): List<IDP>
    // Only CURRENT projects are returned (this story searches the current IDP listing).
    searchIDP(keyword, categoryId) {
        // ask the IDP entity for every IDP matching the keyword / category...
        return new IDP().searchIDP(keyword, categoryId)
            // ...then keep only the CURRENT projects
            .filter(i => i.projectStatus === IDPStatus.CURRENT);
    }
}
