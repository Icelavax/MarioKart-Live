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

    // UI support (not a user story): fills the Category drop-down on the Create IDP form
    // UI support: give a copy of all categories (for drop-downs and lists)
    static getAllCategories() { return [...IDPCategory.categories]; }

    // Set by IDP.js so a category in use cannot be deleted (US42), without a circular import
    static inUse = () => false;
}
