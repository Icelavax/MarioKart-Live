// ==========================================================================
// PRESENTATION NOTE
// <<Entity>> IDPCategory
//
// Used by: US39, US40, US41.
// What to say: The entity holds the data and the business rules that need stored data (duplicate
//              checks, status checks, counts). Each user story calls its own method here through
//              its controller.
//
// Q: Where is the SQL? I do not see any queries here.
// A: The entity works on its in-memory list. database/db.js loads every table from Neon at
//    start-up and saves each change back in one transaction. This keeps the entity classes the
//    same as our BCE diagram and easy to unit test.
// ==========================================================================

// <<Entity>> IDPCategory
// ENTITY class IDPCategory: holds the data and the business rules that need stored data
export default class IDPCategory {
    // all IDP categories are kept in this list (loaded from the database at start-up)
    static categories = [];

    // the fields every category has
    categoryId; categoryName; categoryDescription; createdAt;

    // US39 +createCategory(categoryName: String, categoryDescription: String): Boolean
    // Name is validated by the boundary (CreateIDPCategoryPage). false if the category already exists
    createCategory(categoryName, categoryDescription) {
        // the name to use for the new category
        const name = categoryName;
        // rule: category names must be unique (ignoring upper/lower case) -> fail if taken
        if (IDPCategory.categories.some(c => c.categoryName.toLowerCase() === String(name).toLowerCase())) return false;

        // make a new, empty category object
        const category = new IDPCategory();
        // new ID = biggest existing ID + 1 (or 1 if there are none)
        category.categoryId = Math.max(0, ...IDPCategory.categories.map(c => c.categoryId)) + 1;
        // save the name
        category.categoryName = name;
        // save the description (blank if none)
        category.categoryDescription = categoryDescription ?? '';
        // remember when it was created
        category.createdAt = new Date().toISOString();
        // add it to the list of categories (so it is stored)
        IDPCategory.categories.push(category);
        // success
        return true;
    }

    // US40 +viewCategory(categoryId: Integer): IDPCategory
    // BCE method viewCategory() (gets: categoryId): called by the controller
    viewCategory(categoryId) {
        // return the category with this ID, or null if there is none
        return IDPCategory.categories.find(c => c.categoryId === categoryId) ?? null;
    }

    // US41 +getCategory(categoryID: int): IDPCategory
    // BCE method getCategory() (gets: categoryID): called by the controller
    getCategory(categoryID) {
        // return the category with this ID, or null if there is none
        return IDPCategory.categories.find(c => c.categoryId === categoryID) ?? null;
    }

    // US41 +updateCategory(categoryID: int, categoryName: String, categoryDescription: String): boolean
    // Fields are validated by the boundary. false if the category does not exist (A3)
    // or another category already has this name (A2 duplicate).
    updateCategory(categoryID, categoryName, categoryDescription) {
        // find the category to update
        const category = this.getCategory(categoryID);
        // not found -> report failure
        if (!category) return false;
        // check if ANOTHER category already uses the new name...
        const duplicate = IDPCategory.categories.some(c =>
            // ...(different ID, same name ignoring case)
            c.categoryId !== categoryID && c.categoryName.toLowerCase() === String(categoryName).toLowerCase());
        // name taken -> report failure
        if (duplicate) return false;
        // overwrite the name
        category.categoryName = categoryName;
        // save the description (blank if none)
        category.categoryDescription = categoryDescription ?? '';
        // success
        return true;
    }

    // UI support (not a user story): fills the Category drop-down on the Create IDP form
    // UI support: give a copy of all categories (for drop-downs and lists)
    static getAllCategories() { return [...IDPCategory.categories]; }

    // Set by IDP.js so a category in use cannot be deleted (US42), without a circular import
    static inUse = () => false;
}
