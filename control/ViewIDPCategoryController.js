import IDPCategory from '../entity/IDPCategory.js';

// <<Control>> ViewIDPCategoryController - US40 View IDP Category
export default class ViewIDPCategoryController {
    // +viewCategory(categoryId: Integer): IDPCategory
    viewCategory(categoryId) {
        return new IDPCategory().viewCategory(categoryId);
    }
}
