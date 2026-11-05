// <<Entity>> CompanyProfile
// Each Interior Designer (userId) has at most one company profile.
export default class CompanyProfile {
    static companies = [];

    companyId; userId; companyName; registrationNumber; companyDescription;
    contactEmail; contactNumber;

    // US13 +saveCompanyProfile(userId: Integer, companyName: String, registrationNumber: String,
    //        companyDescription: String, contactEmail: String, contactNumber: String): Boolean
    // Fields are validated by the boundary (CreateCompanyProfilePage.validateDetails).
    // false if the designer already has a company profile
    saveCompanyProfile(userId, companyName, registrationNumber, companyDescription, contactEmail, contactNumber) {
        if (CompanyProfile.companies.some(c => c.userId === userId)) return false;

        const company = new CompanyProfile();
        company.companyId = Math.max(0, ...CompanyProfile.companies.map(c => c.companyId)) + 1;
        company.userId = userId;
        company.companyName = companyName;
        company.registrationNumber = registrationNumber;
        company.companyDescription = companyDescription ?? '';
        company.contactEmail = contactEmail;
        company.contactNumber = contactNumber;
        CompanyProfile.companies.push(company);
        return true;
    }

    // US14 +viewCompanyDetails(userId: Integer): CompanyProfile
    viewCompanyDetails(userId) {
        return CompanyProfile.companies.find(c => c.userId === userId) ?? null;
    }

    // US15 +getCompanyProfile(userId: Integer): CompanyProfile
    // (Sprint 1's US13 diagram used companyId; the Sprint 2 US15 diagram looks it up by userId.)
    getCompanyProfile(userId) {
        return CompanyProfile.companies.find(c => c.userId === userId) ?? null;
    }

    // US15 +updateCompanyDetails(companyName: String, registrationNumber: String, companyDescription: String,
    //                           contactEmail: String, contactNumber: String): Boolean
    // Called on the CompanyProfile object returned by getCompanyProfile(userId).
    // Fields are validated by the boundary (UpdateCompanyProfilePage).
    updateCompanyDetails(companyName, registrationNumber, companyDescription, contactEmail, contactNumber) {
        if (!CompanyProfile.companies.includes(this)) return false;     // not a stored profile
        this.companyName = companyName;
        this.registrationNumber = registrationNumber;
        this.companyDescription = companyDescription ?? '';
        this.contactEmail = contactEmail;
        this.contactNumber = contactNumber;
        return true;
    }

    // US16 +deleteCompanyProfile(userId: Integer): Boolean   (false if the designer has no company profile)
    deleteCompanyProfile(userId) {
        const index = CompanyProfile.companies.findIndex(c => c.userId === userId);
        if (index === -1) return false;
        CompanyProfile.companies.splice(index, 1);
        return true;
    }

    // US17 +searchCompanyProfile(keyword: String): List<CompanyProfile>
    // Matches company name, registration number or description (contains, any case)
    searchCompanyProfile(keyword) {
        const k = String(keyword ?? '').trim().toLowerCase();
        return CompanyProfile.companies.filter(c =>
            c.companyName.toLowerCase().includes(k) ||
            c.registrationNumber.toLowerCase().includes(k) ||
            (c.companyDescription ?? '').toLowerCase().includes(k));
    }
}
