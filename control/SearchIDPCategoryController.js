import IDPCategory from '../entity/IDPCategory.js';

// <<Control>> SearchIDPCategoryController - US43 Search IDP Category
export default class SearchIDPCategoryController {
    // +searchCategory(keyword: String): List<IDPCategory>
    searchCategory(keyword) {
        return new IDPCategory().searchCategory(keyword);
    }
}
