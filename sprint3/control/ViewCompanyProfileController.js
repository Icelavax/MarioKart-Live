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
