// <<Entity>> IDPCategory
export default class IDPCategory {
    static categories = [];

    categoryId; categoryName; categoryDescription; createdAt;

    // US39 +createCategory(categoryName: String, categoryDescription: String): Boolean
    // Name is validated by the boundary (CreateIDPCategoryPage). false if the category already exists
    createCategory(categoryName, categoryDescription) {
        const name = categoryName;
        if (IDPCategory.categories.some(c => c.categoryName.toLowerCase() === String(name).toLowerCase())) return false;

        const category = new IDPCategory();
        category.categoryId = Math.max(0, ...IDPCategory.categories.map(c => c.categoryId)) + 1;
        category.categoryName = name;
        category.categoryDescription = categoryDescription ?? '';
        category.createdAt = new Date().toISOString();
        IDPCategory.categories.push(category);
        return true;
    }

    // US40 +viewCategory(categoryId: Integer): IDPCategory
    viewCategory(categoryId) {
        return IDPCategory.categories.find(c => c.categoryId === categoryId) ?? null;
    }

    // US41 +getCategory(categoryID: int): IDPCategory
    getCategory(categoryID) {
        return IDPCategory.categories.find(c => c.categoryId === categoryID) ?? null;
    }

    // US41 +updateCategory(categoryID: int, categoryName: String, categoryDescription: String): boolean
    // Fields are validated by the boundary. false if the category does not exist (A3)
    // or another category already has this name (A2 duplicate).
    updateCategory(categoryID, categoryName, categoryDescription) {
        const category = this.getCategory(categoryID);
        if (!category) return false;
        const duplicate = IDPCategory.categories.some(c =>
            c.categoryId !== categoryID && c.categoryName.toLowerCase() === String(categoryName).toLowerCase());
        if (duplicate) return false;
        category.categoryName = categoryName;
        category.categoryDescription = categoryDescription ?? '';
        return true;
    }

    // US42 +deleteCategory(categoryID: int): boolean
    // false (A2 deletion failed) if the category does not exist or IDPs still use it
    deleteCategory(categoryID) {
        const index = IDPCategory.categories.findIndex(c => c.categoryId === categoryID);
        if (index === -1) return false;
        if (IDPCategory.inUse(categoryID)) return false;
        IDPCategory.categories.splice(index, 1);
        return true;
    }

    // US43 +searchCategory(keyword: String): List<IDPCategory>   (matches name or description)
    searchCategory(keyword) {
        const k = String(keyword ?? '').trim().toLowerCase();
        return IDPCategory.categories.filter(c =>
            c.categoryName.toLowerCase().includes(k) || (c.categoryDescription ?? '').toLowerCase().includes(k));
    }

    // UI support (not a user story): fills the Category drop-down on the Create IDP form
    static getAllCategories() { return [...IDPCategory.categories]; }

    // Set by IDP.js so a category in use cannot be deleted (US42), without a circular import
    static inUse = () => false;
}
