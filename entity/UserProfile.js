export const ProfileStatus = Object.freeze({ ACTIVE: 'Active', SUSPENDED: 'Suspended' });

// <<Entity>> UserProfile  (a profile = a role, e.g. "Interior Designer")
export default class UserProfile {
    static profiles = [];
    static #nextId = 1;

    profileId; profileName; description; profileStatus; createdAt;

    // US6 +createUserProfile(profileName: String, description: String): Boolean
    // false if the name is blank or already exists
    createUserProfile(profileName, description) {
        if (typeof profileName !== 'string' || profileName.trim() === '') return false;
        const name = profileName.trim();
        if (UserProfile.profiles.some(p => p.profileName.toLowerCase() === name.toLowerCase())) return false;

        const profile = new UserProfile();
        profile.profileId = UserProfile.#nextId++;
        profile.profileName = name;
        profile.description = description ?? '';
        profile.profileStatus = ProfileStatus.ACTIVE;
        profile.createdAt = new Date().toISOString();
        UserProfile.profiles.push(profile);
        return true;
    }

    // Used by the seed / tests to start from empty
    static reset() { UserProfile.profiles.length = 0; UserProfile.#nextId = 1; }

    // UI support (not a user story): fills the User Profile drop-down lists
    static getAllProfiles() { return [...UserProfile.profiles]; }
}
