import CreateCurrentIDPController from '../control/CreateCurrentIDPController.js';
import { Session } from './Session.js';
import { isFilled, isPositiveInteger } from './Validator.js';

// <<Boundary>> CreateCurrentIDPPage - US20 Create Current IDP
export default class CreateCurrentIDPPage {
    // Stand-in for the category / title / description input fields
    form = { categoryId: null, title: '', description: '' };
    #details = null;
    output = null;

    // +displayCreateForm(): void
    // US20 sequence: displayCreateForm() -> captureIDPDetails() -> validateInput() -> createIDP()
    displayCreateForm() {
        this.#show('form', 'Create current IDP form');
        this.captureIDPDetails();
        if (!this.validateInput()) { this.displayFailure(); return; }

        const success = new CreateCurrentIDPController().createIDP(
            Session.userId, this.#details.categoryId, this.#details.title.trim(), this.#details.description.trim());
        if (success === true) this.displaySuccess();      // [success = true]
        else this.displayFailure();                       // [success = false]
    }

    // +captureIDPDetails(): void
    captureIDPDetails() { this.#details = { ...this.form }; }

    // +validateInput(): boolean
    // All field validation for US20 is here; the IDP entity only stores the record.
    validateInput() {
        const d = this.#details;
        return d != null && Session.userId != null && isPositiveInteger(d.categoryId)
            && isFilled(d.title) && isFilled(d.description);
    }

    // +displaySuccess(): void
    displaySuccess() { this.#show('success', 'IDP created'); }

    // +displayFailure(): void
    displayFailure() { this.#show('failure', 'Unable to create IDP - please correct the details and retry'); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[CreateCurrentIDPPage] ${message ?? ''}`, data ?? '');
    }
}
