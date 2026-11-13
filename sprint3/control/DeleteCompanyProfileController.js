// ==========================================================================
// PRESENTATION NOTE
// US16 Delete Company Profile - <<Control>> DeleteCompanyProfileController
//
// What to say: The controller has one job: it takes the request from the boundary page and passes
//              it to CompanyProfile.deleteCompanyProfile(), then hands the answer back. It has no
//              screen and holds no data.
//
// Q: Why have a controller if it only passes the call on?
// A: It keeps the screen and the data apart: the boundary never touches the entity directly. If
//    the business logic changes, only the controller and entity change, not the UI. That is the
//    BCE rule.
// ==========================================================================

// bring in the CompanyProfile entity class (it holds and checks the company profile data)
import CompanyProfile from '../entity/CompanyProfile.js';

// <<Control>> DeleteCompanyProfileController - US16 Delete Company Profile
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class DeleteCompanyProfileController {
    // +deleteCompanyProfile(userId: Integer): Boolean
    // BCE method deleteCompanyProfile() (gets: userId): called by the page
    deleteCompanyProfile(userId) {
        // create a CompanyProfile entity and ask it to delete company profile with userId; hand its answer back to the page
        return new CompanyProfile().deleteCompanyProfile(userId);
    }
}
