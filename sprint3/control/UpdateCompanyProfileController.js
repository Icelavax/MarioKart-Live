// ==========================================================================
// PRESENTATION NOTE
// US15 Update Company Profile - <<Control>> UpdateCompanyProfileController
//
// What to say: The controller has one job: it takes the request from the boundary page and passes
//              it to CompanyProfile.getCompanyProfile(), then hands the answer back. It has no
//              screen and holds no data.
//
// Q: Why have a controller if it only passes the call on?
// A: It keeps the screen and the data apart: the boundary never touches the entity directly. If
//    the business logic changes, only the controller and entity change, not the UI. That is the
//    BCE rule.
// ==========================================================================

// bring in the CompanyProfile entity class (it holds and checks the company profile data)
import CompanyProfile from '../entity/CompanyProfile.js';

// <<Control>> UpdateCompanyProfileController - US15 Update Company Profile
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class UpdateCompanyProfileController {
    // +getCompanyProfile(userId: Integer): CompanyProfile
    // BCE method getCompanyProfile() (gets: userId): called by the page
    getCompanyProfile(userId) {
        // create a CompanyProfile entity and ask it to get company profile with userId; hand its answer back to the page
        return new CompanyProfile().getCompanyProfile(userId);
    }

    // +updateCompanyProfile(userId: Integer, companyName: String, registrationNumber: String,
    //                       companyDescription: String, contactEmail: String, contactNumber: String): Boolean
    updateCompanyProfile(userId, companyName, registrationNumber, companyDescription, contactEmail, contactNumber) {
        // find this designer's company profile
        const profile = this.getCompanyProfile(userId);
        // no company profile for this user -> cannot update, report failure
        if (profile == null) return false;
        // update the details on that company profile and return true / false
        return profile.updateCompanyDetails(companyName, registrationNumber, companyDescription, contactEmail, contactNumber);
    }
}
