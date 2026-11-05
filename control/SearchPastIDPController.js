import IDP, { IDPStatus } from '../entity/IDP.js';

// <<Control>> SearchPastIDPController - US29 Search Past IDP
export default class SearchPastIDPController {
    // +searchIDP(keyword: String, categoryId: Integer): List<IDP>
    // Only PAST projects are returned (this story searches the past IDP listing).
    searchIDP(keyword, categoryId) {
        return new IDP().searchIDP(keyword, categoryId)
            .filter(i => i.projectStatus === IDPStatus.PAST);
    }
}
