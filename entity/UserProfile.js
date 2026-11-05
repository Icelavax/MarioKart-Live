export const ProfileStatus = Object.freeze({ ACTIVE: 'Active', SUSPENDED: 'Suspended' });

// <<Entity>> UserProfile  (a profile = a role, e.g. "Interior Designer")
export default class UserProfile {
    static profiles = [];

    profileId; profileName; description; profileStatus; createdAt;

    // US6 +createUserProfile(profileName: String, description: String): Boolean
    // Name is validated by the boundary (CreateUserProfilePage). false if the name already exists
    createUserProfile(profileName, description) {
        const name = profileName;
        if (UserProfile.profiles.some(p => p.profileName.toLowerCase() === String(name).toLowerCase())) return false;

        const profile = new UserProfile();
        profile.profileId = Math.max(0, ...UserProfile.profiles.map(p => p.profileId)) + 1;
        profile.profileName = name;
        profile.description = description ?? '';
        profile.profileStatus = ProfileStatus.ACTIVE;
        profile.createdAt = new Date().toISOString();
        UserProfile.profiles.push(profile);
        return true;
    }

    // US7 +viewUserProfile(profileId: Integer): UserProfile
    viewUserProfile(profileId) {
        return UserProfile.profiles.find(p => p.profileId === profileId) ?? null;
    }

    // US8 +updateUserProfile(profileId: Integer, profileName: String, description: String): Boolean
    // Name is validated by the boundary (UpdateUserProfilePage).
    // false if the profile does not exist or the new name belongs to another profile
    updateUserProfile(profileId, profileName, description) {
        const profile = this.viewUserProfile(profileId);
        if (!profile) return false;
        const name = profileName;
        const nameTaken = UserProfile.profiles.some(p =>
            p.profileId !== profileId && p.profileName.toLowerCase() === String(name).toLowerCase());
        if (nameTaken) return false;

        profile.profileName = name;
        profile.description = description ?? '';
        return true;
    }

    // US9 +deleteUserProfile(profileId: Integer): Boolean
    deleteUserProfile(profileId) {
        const index = UserProfile.profiles.findIndex(p => p.profileId === profileId);
        if (index === -1) return false;
        UserProfile.profiles.splice(index, 1);
        return true;
    }

    // US10 +searchUserProfile(keyword: String): List<UserProfile>   (matches profile name)
    searchUserProfile(keyword) {
        const k = (keyword ?? '').trim().toLowerCase();
        return UserProfile.profiles.filter(p => p.profileName.toLowerCase().includes(k));
    }

    // Used by the seed / tests to start from empty
    static reset() { UserProfile.profiles.length = 0; }

    // UI support (not a user story): fills the User Profile drop-down lists
    static getAllProfiles() { return [...UserProfile.profiles]; }
}
