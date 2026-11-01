import CreateCurrentIDPController from '../control/CreateCurrentIDPController.js';
import { Session } from './Session.js';

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
            Session.userId, this.#details.categoryId, this.#details.title, this.#details.description);
        if (success === true) this.displaySuccess();      // [success = true]
        else this.displayFailure();                       // [success = false]
    }

    // +captureIDPDetails(): void
    captureIDPDetails() { this.#details = { ...this.form }; }

    // +validateInput(): boolean
    validateInput() {
        const d = this.#details;
        return d != null && Number.isInteger(d.categoryId)
            && typeof d.title === 'string' && d.title.trim() !== ''
            && typeof d.description === 'string' && d.description.trim() !== '';
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
