// bring in the IDPCategory entity class (it holds and checks the idp category data)
import IDPCategory from '../entity/IDPCategory.js';

// <<Control>> SearchIDPCategoryController - US43 Search IDP Category
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class SearchIDPCategoryController {
    // +searchCategory(keyword: String): List<IDPCategory>
    // BCE method searchCategory() (gets: keyword): called by the page
    searchCategory(keyword) {
        // create a IDPCategory entity and ask it to search category with keyword; hand its answer back to the page
        return new IDPCategory().searchCategory(keyword);
    }
}
