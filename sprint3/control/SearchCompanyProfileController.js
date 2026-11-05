// bring in the CompanyProfile entity class (it holds and checks the company profile data)
import CompanyProfile from '../entity/CompanyProfile.js';

// <<Control>> SearchCompanyProfileController - US17 Search Company Profile
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class SearchCompanyProfileController {
    // +searchCompanyProfile(keyword: String): List<CompanyProfile>
    // BCE method searchCompanyProfile() (gets: keyword): called by the page
    searchCompanyProfile(keyword) {
        // create a CompanyProfile entity and ask it to search company profile with keyword; hand its answer back to the page
        return new CompanyProfile().searchCompanyProfile(keyword);
    }
}
