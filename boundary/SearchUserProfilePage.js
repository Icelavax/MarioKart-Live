import SearchUserProfileController from '../control/SearchUserProfileController.js';

// <<Boundary>> SearchUserProfilePage - US10 Search User Profile
export default class SearchUserProfilePage {
    results = [];
    output = null;

    // ---- UI events (actor arrows in the sequence diagram; not BCE methods) ----
    // User Admin enters a profile name, clicks "Search"
    clickSearch(keyword) {
        if (typeof keyword !== 'string' || keyword.trim() === '') {           // [keyword is empty]
            this.displayError('Please enter a profile name');
            return;
        }
        const profiles = new SearchUserProfileController().searchUserProfile(keyword.trim());   // [keyword is not empty]
        if (profiles.length > 0) this.displayResults(profiles);             // [profiles is not empty]
        else this.displayError('No matching user profiles found');           // [profiles is empty]
    }
    // User Admin selects a user profile from the list
    selectProfile(profile) { this.displayProfileDetails(profile); }

    // ---- BCE methods ----
    // +displayResults(profiles: List<UserProfile>): void
    displayResults(profiles) {
        this.results = profiles;
        this.#show('data', `${profiles.length} profile(s) found`, profiles.map(p => ({
            profileName: p.profileName, description: p.description, profileStatus: p.profileStatus })));
    }

    // +displayProfileDetails(profile: UserProfile): void
    displayProfileDetails(profile) { this.#show('data', 'Profile details', { ...profile }); }

    // +displayError(message: String): void
    displayError(message) { this.#show('error', message); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[SearchUserProfilePage] ${message ?? ''}`, data ?? '');
    }
}
