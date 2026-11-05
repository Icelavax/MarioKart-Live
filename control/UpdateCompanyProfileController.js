import CompanyProfile from '../entity/CompanyProfile.js';

// <<Control>> UpdateCompanyProfileController - US15 Update Company Profile
export default class UpdateCompanyProfileController {
    // +getCompanyProfile(userId: Integer): CompanyProfile
    getCompanyProfile(userId) {
        return new CompanyProfile().getCompanyProfile(userId);
    }

    // +updateCompanyProfile(userId: Integer, companyName: String, registrationNumber: String,
    //                       companyDescription: String, contactEmail: String, contactNumber: String): Boolean
    updateCompanyProfile(userId, companyName, registrationNumber, companyDescription, contactEmail, contactNumber) {
        const profile = this.getCompanyProfile(userId);
        if (profile == null) return false;
        return profile.updateCompanyDetails(companyName, registrationNumber, companyDescription, contactEmail, contactNumber);
    }
}
