// bring in SearchUserProfileController - this page passes the user's request to it
import SearchUserProfileController from '../control/SearchUserProfileController.js';

// <<Boundary>> SearchUserProfilePage - US10 Search User Profile
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class SearchUserProfilePage {
    // the last search results shown on screen; starts as an empty list
    results = [];
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // ---- UI events (actor arrows in the sequence diagram; not BCE methods) ----
    // User Admin enters a profile name, clicks "Search"
    clickSearch(keyword) {
        if (typeof keyword !== 'string' || keyword.trim() === '') {           // [keyword is empty]
            // keyword is blank -> show this message
            this.displayError('Please enter a profile name');
            // stop here
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
    // BCE method displayResults() (gets: profiles)
    displayResults(profiles) {
        // remember the results
        this.results = profiles;
        // show how many were found and, for each, only these fields:
        this.#show('data', `${profiles.length} profile(s) found`, profiles.map(p => ({
            // name, description and status
            profileName: p.profileName, description: p.description, profileStatus: p.profileStatus })));
    }

    // +displayProfileDetails(profile: UserProfile): void
    // BCE method: show the profile details (a copy)
    displayProfileDetails(profile) { this.#show('data', 'Profile details', { ...profile }); }

    // +displayError(message: String): void
    // BCE method: show the error message that was passed in (message)
    displayError(message) { this.#show('error', message); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[SearchUserProfilePage] ${message ?? ''}`, data ?? '');
    }
}
