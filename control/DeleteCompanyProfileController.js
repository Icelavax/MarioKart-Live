import CompanyProfile from '../entity/CompanyProfile.js';

// <<Control>> DeleteCompanyProfileController - US16 Delete Company Profile
export default class DeleteCompanyProfileController {
    // +deleteCompanyProfile(userId: Integer): Boolean
    deleteCompanyProfile(userId) {
        return new CompanyProfile().deleteCompanyProfile(userId);
    }
}
