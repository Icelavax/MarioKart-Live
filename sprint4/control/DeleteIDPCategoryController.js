// bring in the IDPCategory entity class (it holds and checks the idp category data)
import IDPCategory from '../entity/IDPCategory.js';

// <<Control>> DeleteIDPCategoryController - US42 Delete IDP Category
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class DeleteIDPCategoryController {
    // +deleteCategory(categoryID: int): boolean
    // BCE method deleteCategory() (gets: categoryID): called by the page
    deleteCategory(categoryID) {
        // create a IDPCategory entity and ask it to delete category with categoryID; hand its answer back to the page
        return new IDPCategory().deleteCategory(categoryID);
    }
}
