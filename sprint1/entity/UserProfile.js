// the two possible profile statuses (frozen = cannot be changed by mistake)
export const ProfileStatus = Object.freeze({ ACTIVE: 'Active', SUSPENDED: 'Suspended' });

// <<Entity>> UserProfile  (a profile = a role, e.g. "Interior Designer")
// ENTITY class UserProfile: holds the data and the business rules that need stored data
export default class UserProfile {
    // all user profiles (roles) are kept in this list (loaded from the database at start-up)
    static profiles = [];

    // the fields every user profile has
    profileId; profileName; description; profileStatus; createdAt;

    // US6 +createUserProfile(profileName: String, description: String): Boolean
    // Name is validated by the boundary (CreateUserProfilePage). false if the name already exists
    createUserProfile(profileName, description) {
        // the name to use for the new profile
        const name = profileName;
        // rule: profile names must be unique (ignoring upper/lower case) -> fail if taken
        if (UserProfile.profiles.some(p => p.profileName.toLowerCase() === String(name).toLowerCase())) return false;

        // make a new, empty profile object
        const profile = new UserProfile();
        // new ID = biggest existing ID + 1 (or 1 if there are none)
        profile.profileId = Math.max(0, ...UserProfile.profiles.map(p => p.profileId)) + 1;
        // save the name
        profile.profileName = name;
        // save the description (blank if none)
        profile.description = description ?? '';
        // new profiles start as Active
        profile.profileStatus = ProfileStatus.ACTIVE;
        // remember when it was created
        profile.createdAt = new Date().toISOString();
        // add it to the list of profiles (so it is stored)
        UserProfile.profiles.push(profile);
        // success
        return true;
    }

    // Used by the seed / tests to start from empty
    static reset() { UserProfile.profiles.length = 0; }

    // UI support (not a user story): fills the User Profile drop-down lists
    // UI support: give a copy of all profiles (for drop-downs and lists)
    static getAllProfiles() { return [...UserProfile.profiles]; }
}
