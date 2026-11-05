import IDPCategory from '../entity/IDPCategory.js';

// <<Control>> DeleteIDPCategoryController - US42 Delete IDP Category
export default class DeleteIDPCategoryController {
    // +deleteCategory(categoryID: int): boolean
    deleteCategory(categoryID) {
        return new IDPCategory().deleteCategory(categoryID);
    }
}
