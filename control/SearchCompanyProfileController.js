import CompanyProfile from '../entity/CompanyProfile.js';

// <<Control>> SearchCompanyProfileController - US17 Search Company Profile
export default class SearchCompanyProfileController {
    // +searchCompanyProfile(keyword: String): List<CompanyProfile>
    searchCompanyProfile(keyword) {
        return new CompanyProfile().searchCompanyProfile(keyword);
    }
}
