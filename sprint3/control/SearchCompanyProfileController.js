// ==========================================================================
// PRESENTATION NOTE
// US17 Search Company Profile - <<Control>> SearchCompanyProfileController
//
// What to say: The controller has one job: it takes the request from the boundary page and passes
//              it to CompanyProfile.searchCompanyProfile(), then hands the answer back. It has no
//              screen and holds no data.
//
// Q: Why have a controller if it only passes the call on?
// A: It keeps the screen and the data apart: the boundary never touches the entity directly. If
//    the business logic changes, only the controller and entity change, not the UI. That is the
//    BCE rule.
// ==========================================================================

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
