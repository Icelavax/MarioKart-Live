// ==========================================================================
// PRESENTATION NOTE
// <<Entity>> CompanyProfile
//
// Used by: US13, US14, US15, US16, US17.
// What to say: The entity holds the data and the business rules that need stored data (duplicate
//              checks, status checks, counts). Each user story calls its own method here through
//              its controller.
//
// Q: Where is the SQL? I do not see any queries here.
// A: The entity works on its in-memory list. database/db.js loads every table from Neon at
//    start-up and saves each change back in one transaction. This keeps the entity classes the
//    same as our BCE diagram and easy to unit test.
// ==========================================================================

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

    // US14 +viewCompanyDetails(userId: Integer): CompanyProfile
    // BCE method viewCompanyDetails() (gets: userId): called by the controller
    viewCompanyDetails(userId) {
        // return this designer's company profile, or null if they do not have one
        return CompanyProfile.companies.find(c => c.userId === userId) ?? null;
    }

    // US15 +getCompanyProfile(userId: Integer): CompanyProfile
    // (Sprint 1's US13 diagram used companyId; the Sprint 2 US15 diagram looks it up by userId.)
    getCompanyProfile(userId) {
        // return this designer's company profile, or null if they do not have one
        return CompanyProfile.companies.find(c => c.userId === userId) ?? null;
    }

    // US15 +updateCompanyDetails(companyName: String, registrationNumber: String, companyDescription: String,
    //                           contactEmail: String, contactNumber: String): Boolean
    // Called on the CompanyProfile object returned by getCompanyProfile(userId).
    // Fields are validated by the boundary (UpdateCompanyProfilePage).
    updateCompanyDetails(companyName, registrationNumber, companyDescription, contactEmail, contactNumber) {
        if (!CompanyProfile.companies.includes(this)) return false;     // not a stored profile
        // overwrite the company name
        this.companyName = companyName;
        // overwrite the registration number
        this.registrationNumber = registrationNumber;
        // overwrite the description (blank if none)
        this.companyDescription = companyDescription ?? '';
        // overwrite the contact email
        this.contactEmail = contactEmail;
        // overwrite the contact number
        this.contactNumber = contactNumber;
        // success
        return true;
    }

    // US16 +deleteCompanyProfile(userId: Integer): Boolean   (false if the designer has no company profile)
    // BCE method deleteCompanyProfile() (gets: userId): called by the controller
    deleteCompanyProfile(userId) {
        // find where this designer's profile sits in the list (-1 = not found)
        const index = CompanyProfile.companies.findIndex(c => c.userId === userId);
        // not found -> nothing to delete, report failure
        if (index === -1) return false;
        // remove 1 item at that position from the list = delete it
        CompanyProfile.companies.splice(index, 1);
        // success
        return true;
    }

    // US17 +searchCompanyProfile(keyword: String): List<CompanyProfile>
    // Matches company name, registration number or description (contains, any case)
    searchCompanyProfile(keyword) {
        // tidy the keyword: turn null into '', trim spaces, make lower-case (so search ignores case)
        const k = String(keyword ?? '').trim().toLowerCase();
        // return every company profile where...
        return CompanyProfile.companies.filter(c =>
            // ...the company name contains the keyword, or
            c.companyName.toLowerCase().includes(k) ||
            // ...the registration number contains it, or
            c.registrationNumber.toLowerCase().includes(k) ||
            // ...the description contains it
            (c.companyDescription ?? '').toLowerCase().includes(k));
    }
}
