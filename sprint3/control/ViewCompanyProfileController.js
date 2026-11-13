// ==========================================================================
// PRESENTATION NOTE
// US14 View Company Profile - <<Control>> ViewCompanyProfileController
//
// What to say: The controller has one job: it takes the request from the boundary page and passes
//              it to CompanyProfile.viewCompanyDetails(), then hands the answer back. It has no
//              screen and holds no data.
//
// Q: Why have a controller if it only passes the call on?
// A: It keeps the screen and the data apart: the boundary never touches the entity directly. If
//    the business logic changes, only the controller and entity change, not the UI. That is the
//    BCE rule.
// ==========================================================================

// bring in the CompanyProfile entity class (it holds and checks the company profile data)
import CompanyProfile from '../entity/CompanyProfile.js';

// <<Control>> ViewCompanyProfileController - US14 View Company Profile
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class ViewCompanyProfileController {
    // +viewCompanyProfile(userId: Integer): CompanyProfile
    // BCE method viewCompanyProfile() (gets: userId): called by the page
    viewCompanyProfile(userId) {
        // create a CompanyProfile entity and ask it to view company details with userId; hand its answer back to the page
        return new CompanyProfile().viewCompanyDetails(userId);
    }
}
