import IDP, { IDPStatus } from '../entity/IDP.js';

// <<Control>> SearchCurrentIDPController - US24 Search Current IDP
export default class SearchCurrentIDPController {
    // +searchIDP(keyword: String, categoryId: Integer): List<IDP>
    // Only CURRENT projects are returned (this story searches the current IDP listing).
    searchIDP(keyword, categoryId) {
        return new IDP().searchIDP(keyword, categoryId)
            .filter(i => i.projectStatus === IDPStatus.CURRENT);
    }
}
