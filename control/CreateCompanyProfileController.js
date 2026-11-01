import CompanyProfile from '../entity/CompanyProfile.js';

// <<Control>> CreateCompanyProfileController - US13 Create Company Profile
export default class CreateCompanyProfileController {
    // +createCompanyProfile(userId: Integer, companyName: String, registrationNumber: String,
    //                       companyDescription: String, contactEmail: String, contactNumber: String): Boolean
    createCompanyProfile(userId, companyName, registrationNumber, companyDescription, contactEmail, contactNumber) {
        if (!this.validateDetails(companyName, registrationNumber, contactEmail)) return false;
        return new CompanyProfile().saveCompanyProfile(
            userId, companyName, registrationNumber, companyDescription, contactEmail, contactNumber);
    }

    // +validateDetails(companyName: String, registrationNumber: String, contactEmail: String): Boolean
    validateDetails(companyName, registrationNumber, contactEmail) {
        const filled = v => typeof v === 'string' && v.trim() !== '';
        return filled(companyName) && filled(registrationNumber)
            && typeof contactEmail === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim());
    }
}
