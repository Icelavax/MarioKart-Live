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
