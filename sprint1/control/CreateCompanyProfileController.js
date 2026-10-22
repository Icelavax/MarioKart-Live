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
