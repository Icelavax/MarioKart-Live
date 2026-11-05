import CompanyProfile from '../entity/CompanyProfile.js';

// <<Control>> ViewCompanyProfileController - US14 View Company Profile
export default class ViewCompanyProfileController {
    // +viewCompanyProfile(userId: Integer): CompanyProfile
    viewCompanyProfile(userId) {
        return new CompanyProfile().viewCompanyDetails(userId);
    }
}
