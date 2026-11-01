// <<Entity>> CompanyProfile
// Each Interior Designer (userId) has at most one company profile.
export default class CompanyProfile {
    static companies = [];

    companyId; userId; companyName; registrationNumber; companyDescription;
    contactEmail; contactNumber;

    // US13 +saveCompanyProfile(userId: Integer, companyName: String, registrationNumber: String,
    //        companyDescription: String, contactEmail: String, contactNumber: String): Boolean
    // false if the designer already has a company profile or a required field is missing
    saveCompanyProfile(userId, companyName, registrationNumber, companyDescription, contactEmail, contactNumber) {
        if (userId == null) return false;
        const filled = v => typeof v === 'string' && v.trim() !== '';
        if (!filled(companyName) || !filled(registrationNumber) || !filled(contactEmail)) return false;
        if (!filled(contactNumber)) return false;
        if (CompanyProfile.companies.some(c => c.userId === userId)) return false;

        const company = new CompanyProfile();
        company.companyId = CompanyProfile.companies.length + 1;
        company.userId = userId;
        company.companyName = companyName.trim();
        company.registrationNumber = registrationNumber.trim();
        company.companyDescription = companyDescription ?? '';
        company.contactEmail = contactEmail.trim();
        company.contactNumber = contactNumber.trim();
        CompanyProfile.companies.push(company);
        return true;
    }

    // US13 +getCompanyProfile(companyId: Integer): CompanyProfile
    getCompanyProfile(companyId) {
        return CompanyProfile.companies.find(c => c.companyId === companyId) ?? null;
    }
}
