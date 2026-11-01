import IDPCategory from '../entity/IDPCategory.js';

// <<Control>> CreateIDPCategoryController - US39 Create IDP Category
export default class CreateIDPCategoryController {
    // +createCategory(categoryName: String, categoryDescription: String): Boolean
    createCategory(categoryName, categoryDescription) {
        return new IDPCategory().createCategory(categoryName, categoryDescription);
    }
}
