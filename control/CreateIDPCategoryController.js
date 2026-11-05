// bring in the IDPCategory entity class (it holds and checks the idp category data)
import IDPCategory from '../entity/IDPCategory.js';

// <<Control>> CreateIDPCategoryController - US39 Create IDP Category
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class CreateIDPCategoryController {
    // +createCategory(categoryName: String, categoryDescription: String): Boolean
    // BCE method createCategory() (gets: categoryName, categoryDescription): called by the page
    createCategory(categoryName, categoryDescription) {
        // create a IDPCategory entity and ask it to create category with categoryName, categoryDescription; hand its answer back to the page
        return new IDPCategory().createCategory(categoryName, categoryDescription);
    }
}
