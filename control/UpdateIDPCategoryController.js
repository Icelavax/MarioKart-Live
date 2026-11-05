import IDPCategory from '../entity/IDPCategory.js';

// <<Control>> UpdateIDPCategoryController - US41 Update IDP Category
export default class UpdateIDPCategoryController {
    // +getCategory(categoryID: int): IDPCategory
    getCategory(categoryID) {
        return new IDPCategory().getCategory(categoryID);
    }

    // +updateCategory(categoryID: int, categoryName: String, categoryDescription: String): boolean
    updateCategory(categoryID, categoryName, categoryDescription) {
        return new IDPCategory().updateCategory(categoryID, categoryName, categoryDescription);
    }
}
