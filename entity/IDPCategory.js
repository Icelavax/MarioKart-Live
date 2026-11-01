// <<Entity>> IDPCategory
export default class IDPCategory {
    static categories = [];

    categoryId; categoryName; categoryDescription; createdAt;

    // US39 +createCategory(categoryName: String, categoryDescription: String): Boolean
    // false if the name is blank or the category already exists
    createCategory(categoryName, categoryDescription) {
        if (typeof categoryName !== 'string' || categoryName.trim() === '') return false;
        const name = categoryName.trim();
        if (IDPCategory.categories.some(c => c.categoryName.toLowerCase() === name.toLowerCase())) return false;

        const category = new IDPCategory();
        category.categoryId = IDPCategory.categories.length + 1;
        category.categoryName = name;
        category.categoryDescription = categoryDescription ?? '';
        category.createdAt = new Date().toISOString();
        IDPCategory.categories.push(category);
        return true;
    }

    // UI support (not a user story): fills the Category drop-down on the Create IDP form
    static getAllCategories() { return [...IDPCategory.categories]; }
}
