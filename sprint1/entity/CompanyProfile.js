// <<Entity>> CompanyProfile
// Each Interior Designer (userId) has at most one company profile.
export default class CompanyProfile {
    // all company profiles are kept in this list (loaded from the database at start-up)
    static companies = [];

    // the fields every company profile has...
    companyId; userId; companyName; registrationNumber; companyDescription;
    // ...continued: contact email and contact number
    contactEmail; contactNumber;

    // US13 +saveCompanyProfile(userId: Integer, companyName: String, registrationNumber: String,
    //        companyDescription: String, contactEmail: String, contactNumber: String): Boolean
    // Fields are validated by the boundary (CreateCompanyProfilePage.validateDetails).
    // false if the designer already has a company profile
    saveCompanyProfile(userId, companyName, registrationNumber, companyDescription, contactEmail, contactNumber) {
        // rule: a designer can only have ONE company profile -> fail if they already have one
        if (CompanyProfile.companies.some(c => c.userId === userId)) return false;

        // make a new, empty company profile object
        const company = new CompanyProfile();
        // new ID = biggest existing ID + 1 (or 1 if there are none)
        company.companyId = Math.max(0, ...CompanyProfile.companies.map(c => c.companyId)) + 1;
        // link it to the designer who owns it
        company.userId = userId;
        // save the company name
        company.companyName = companyName;
        // save the registration number
        company.registrationNumber = registrationNumber;
        // save the description (blank if none was given)
        company.companyDescription = companyDescription ?? '';
        // save the contact email
        company.contactEmail = contactEmail;
        // save the contact number
        company.contactNumber = contactNumber;
        // add it to the list of company profiles (so it is stored)
        CompanyProfile.companies.push(company);
        // success
        return true;
    }

    // US13 +getCompanyProfile(companyId: Integer): CompanyProfile
    // BCE method getCompanyProfile() (gets: companyId): called by the controller
    getCompanyProfile(companyId) {
        // return the company profile with this company ID, or null if there is none
        return CompanyProfile.companies.find(c => c.companyId === companyId) ?? null;
    }
}
