// ==========================================================================
// PRESENTATION NOTE
// <<Entity>> UserProfile  (a profile = a role, e.g. "Interior Designer")
//
// Used by: US6, US7, US8, US9, US10.
// What to say: The entity holds the data and the business rules that need stored data (duplicate
//              checks, status checks, counts). Each user story calls its own method here through
//              its controller.
//
// Q: Where is the SQL? I do not see any queries here.
// A: The entity works on its in-memory list. database/db.js loads every table from Neon at
//    start-up and saves each change back in one transaction. This keeps the entity classes the
//    same as our BCE diagram and easy to unit test.
// ==========================================================================

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

    // US7 +viewUserProfile(profileId: Integer): UserProfile
    // BCE method viewUserProfile() (gets: profileId): called by the controller
    viewUserProfile(profileId) {
        // return the profile with this ID, or null if there is none
        return UserProfile.profiles.find(p => p.profileId === profileId) ?? null;
    }

    // US8 +updateUserProfile(profileId: Integer, profileName: String, description: String): Boolean
    // Name is validated by the boundary (UpdateUserProfilePage).
    // false if the profile does not exist or the new name belongs to another profile
    updateUserProfile(profileId, profileName, description) {
        // find the profile to update
        const profile = this.viewUserProfile(profileId);
        // not found -> report failure
        if (!profile) return false;
        // the name to use for the new profile
        const name = profileName;
        // check if ANOTHER profile already uses the new name...
        const nameTaken = UserProfile.profiles.some(p =>
            // ...(different ID, same name ignoring case)
            p.profileId !== profileId && p.profileName.toLowerCase() === String(name).toLowerCase());
        // name taken -> report failure
        if (nameTaken) return false;

        // save the name
        profile.profileName = name;
        // save the description (blank if none)
        profile.description = description ?? '';
        // success
        return true;
    }

    // US9 +deleteUserProfile(profileId: Integer): Boolean
    // BCE method deleteUserProfile() (gets: profileId): called by the controller
    deleteUserProfile(profileId) {
        // find where this profile sits in the list (-1 = not found)
        const index = UserProfile.profiles.findIndex(p => p.profileId === profileId);
        // not found -> nothing to delete, report failure
        if (index === -1) return false;
        // remove 1 item at that position = delete the profile
        UserProfile.profiles.splice(index, 1);
        // success
        return true;
    }

    // US10 +searchUserProfile(keyword: String): List<UserProfile>   (matches profile name)
    // BCE method searchUserProfile() (gets: keyword): called by the controller
    searchUserProfile(keyword) {
        // tidy the keyword: turn null into '', trim spaces, make lower-case
        const k = (keyword ?? '').trim().toLowerCase();
        // return every profile whose name contains the keyword
        return UserProfile.profiles.filter(p => p.profileName.toLowerCase().includes(k));
    }

    // Used by the seed / tests to start from empty
    static reset() { UserProfile.profiles.length = 0; }

    // UI support (not a user story): fills the User Profile drop-down lists
    // UI support: give a copy of all profiles (for drop-downs and lists)
    static getAllProfiles() { return [...UserProfile.profiles]; }
}
