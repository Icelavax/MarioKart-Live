// bring in the IDPCategory entity class (it holds and checks the idp category data)
import IDPCategory from '../entity/IDPCategory.js';

// <<Control>> UpdateIDPCategoryController - US41 Update IDP Category
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class UpdateIDPCategoryController {
    // +getCategory(categoryID: int): IDPCategory
    // BCE method getCategory() (gets: categoryID): called by the page
    getCategory(categoryID) {
        // create a IDPCategory entity and ask it to get category with categoryID; hand its answer back to the page
        return new IDPCategory().getCategory(categoryID);
    }

    // +updateCategory(categoryID: int, categoryName: String, categoryDescription: String): boolean
    // BCE method updateCategory() (gets: categoryID, categoryName, categoryDescription): called by the page
    updateCategory(categoryID, categoryName, categoryDescription) {
        // create a IDPCategory entity and ask it to update category with categoryID, categoryName, categoryDescription; hand its answer back to the page
        return new IDPCategory().updateCategory(categoryID, categoryName, categoryDescription);
    }
}
