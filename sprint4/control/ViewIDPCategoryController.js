// bring in the IDPCategory entity class (it holds and checks the idp category data)
import IDPCategory from '../entity/IDPCategory.js';

// <<Control>> ViewIDPCategoryController - US40 View IDP Category
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class ViewIDPCategoryController {
    // +viewCategory(categoryId: Integer): IDPCategory
    // BCE method viewCategory() (gets: categoryId): called by the page
    viewCategory(categoryId) {
        // create a IDPCategory entity and ask it to view category with categoryId; hand its answer back to the page
        return new IDPCategory().viewCategory(categoryId);
    }
}
