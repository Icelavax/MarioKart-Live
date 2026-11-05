import CreateIDPCategoryController from '../control/CreateIDPCategoryController.js';
import { isFilled } from './Validator.js';

// <<Boundary>> CreateIDPCategoryPage - US39 Create IDP Category
export default class CreateIDPCategoryPage {
    // Stand-in for the category name / description input fields
    form = { categoryName: '', categoryDescription: '' };
    output = null;

    // +clickCreate(): void
    clickCreate() {
        if (!isFilled(this.form.categoryName)) {                       // field validation (boundary)
            this.displayMessage('Category name is required');
            return;
        }
        const result = new CreateIDPCategoryController()
            .createCategory(this.form.categoryName.trim(), (this.form.categoryDescription ?? '').trim());
        if (result === true) this.displayMessage('Category created successfully');   // [Boolean == true]
        else this.displayMessage('Unable to create category');                       // [Boolean == false]
    }

    // +displayMessage(message: String): void
    displayMessage(message) {
        this.#show(message === 'Category created successfully' ? 'success' : 'error', message);
    }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[CreateIDPCategoryPage] ${message ?? ''}`, data ?? '');
    }
}
