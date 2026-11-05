import CompanyProfile from '../entity/CompanyProfile.js';

// <<Control>> CreateCompanyProfileController - US13 Create Company Profile
export default class CreateCompanyProfileController {
    // +createCompanyProfile(userId: Integer, companyName: String, registrationNumber: String, companyDescription: String, contactEmail: String, contactNumber: String): Boolean
    createCompanyProfile(userId, companyName, registrationNumber, companyDescription, contactEmail, contactNumber) {
        return new CompanyProfile().saveCompanyProfile(userId, companyName, registrationNumber, companyDescription, contactEmail, contactNumber);
    }
}
