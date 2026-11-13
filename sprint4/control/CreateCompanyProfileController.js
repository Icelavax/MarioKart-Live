// ==========================================================================
// PRESENTATION NOTE
// US13 Create Company Profile - <<Control>> CreateCompanyProfileController
//
// What to say: The controller has one job: it takes the request from the boundary page and passes
//              it to CompanyProfile.saveCompanyProfile(), then hands the answer back. It has no
//              screen and holds no data.
//
// Q: Why have a controller if it only passes the call on?
// A: It keeps the screen and the data apart: the boundary never touches the entity directly. If
//    the business logic changes, only the controller and entity change, not the UI. That is the
//    BCE rule.
// ==========================================================================

// bring in the CompanyProfile entity class (it holds and checks the company profile data)
import CompanyProfile from '../entity/CompanyProfile.js';

// <<Control>> CreateCompanyProfileController - US13 Create Company Profile
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class CreateCompanyProfileController {
    // +createCompanyProfile(userId: Integer, companyName: String, registrationNumber: String, companyDescription: String, contactEmail: String, contactNumber: String): Boolean
    // BCE method createCompanyProfile() (gets: userId, companyName, registrationNumber, companyDescription, contactEmail, contactNumber): called by the page
    createCompanyProfile(userId, companyName, registrationNumber, companyDescription, contactEmail, contactNumber) {
        // create a CompanyProfile entity and ask it to save company profile with userId, companyName, registrationNumber, companyDescription, contactEmail, contactNumber; hand its answer back to the page
        return new CompanyProfile().saveCompanyProfile(userId, companyName, registrationNumber, companyDescription, contactEmail, contactNumber);
    }
}
