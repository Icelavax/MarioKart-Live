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
