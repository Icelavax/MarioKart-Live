// ==========================================================================
// PRESENTATION NOTE
// database/demoData.js - demo data for the UI
//
// What to say: Gives every screen something to show: categories, IDPs, company profiles, views
//              and saved IDPs spread over recent weeks so the reports have data. Records are
//              created through the entity methods.
//
// Q: Do the tests use this?
// A: No, only the web UI does. The tests use seed.js and testData.js.
// ==========================================================================

// Demo data for the web UI only (the tests do not use it).
// Gives every screen something to show: categories, IDPs (current + past), company profiles,
// and - in later sprints - customer views and saved IDPs, spread over the last few weeks
// so the reports have data. Records are created through the entity methods where one exists.
import UserAccount from '../entity/UserAccount.js';
// bring in the IDPCategory entity class (it holds and checks the idp category data)
import IDPCategory from '../entity/IDPCategory.js';
// bring in the IDP entity class (it holds and checks the idp data), plus IDPStatus
import IDP, { IDPStatus } from '../entity/IDP.js';
// bring in the CompanyProfile entity class (it holds and checks the company profile data)
import CompanyProfile from '../entity/CompanyProfile.js';
// bring in the IDPViewRecord entity class (it holds and checks the idp view record data)
import IDPViewRecord from '../entity/IDPViewRecord.js';

// helper: a date-time n days ago (at a different hour each day) - spreads the demo data over time
const daysAgo = n => { const d = new Date(); d.setDate(d.getDate() - n); d.setHours(10 + (n % 8), 15, 0, 0); return d.toISOString(); };

// adds example data so the screens are not empty (categories, IDPs, companies, views, saves)
export function loadDemoData() {
    // make a new, empty category object
    const category = new IDPCategory();
    // the demo categories: [name, description]...
    [['Modern', 'Clean lines and neutral palettes'], ['Traditional', 'Classic and heritage interiors'],
     // ...continued
     ['Minimalist', 'Less is more - open, uncluttered spaces'], ['Industrial', 'Raw materials, metal and concrete'],
     // ...continued
     ['Kitchen', 'Kitchen renovation projects'], ['Bedroom', 'Bedroom makeovers']]
        // create each category through the IDPCategory entity
        .forEach(([name, desc]) => category.createCategory(name, desc));
    // helper: find a category's ID by its name
    const cat = name => IDPCategory.getAllCategories().find(c => c.categoryName === name).categoryId;

    // all active Interior Designer accounts (profile 2)
    const designers = UserAccount.accounts.filter(a => a.profileId === 2 && a.accountStatus === 'Active');
    // make a new, empty IDP object
    const idp = new IDP();
    // the demo IDPs: [title, category, description, design style]
    const projects = [
        // demo IDP
        ['Japanese Modern', 'Modern', 'Clean Japanese lines with warm wood', 'Japandi'],
        // demo IDP
        ['Japanese Tatami', 'Traditional', 'Tatami bedroom with sliding doors', 'Japanese'],
        // demo IDP
        ['European Style', 'Traditional', 'Classic mouldings and soft colours', 'European'],
        // demo IDP
        ['Minimalist White', 'Minimalist', 'All-white open-plan living', 'Minimalist'],
        // demo IDP
        ['Art Deco Modern', 'Modern', 'Geometric patterns with brass accents', 'Art Deco'],
        // demo IDP
        ['Traditional Style', 'Traditional', 'Heritage furniture and rich timber', 'Peranakan'],
        // demo IDP
        ['Chinese Modern', 'Modern', 'Modern take on Chinese motifs', 'Oriental'],
        // demo IDP
        ['Wood Industrial', 'Industrial', 'Raw wood with black steel', 'Industrial'],
        // demo IDP
        ['Compact HDB Kitchen', 'Kitchen', 'Space-saving kitchen for a 4-room flat', 'Scandinavian'],
        // demo IDP
        ['Cosy Master Bedroom', 'Bedroom', 'Warm lighting and built-in wardrobes', 'Contemporary'],
    ];
    // for each demo IDP (n = its position, 0, 1, 2, ...)...
    projects.forEach(([title, c, desc, style], n) => {
        // ...the first 6 belong to the first designer, the rest are shared among the other designers
        const owner = n < 6 ? designers[0] : designers[(n % (designers.length - 1)) + 1] ?? designers[0];
        // ...create it through the IDP entity
        idp.createIDP(owner.userId, cat(c), title, desc);
        // ...get the IDP that was just created (the last one in the list)
        const made = IDP.idps[IDP.idps.length - 1];
        // ...set its design style
        made.designStyle = style;
        // ...pretend it was created some days ago (so reports have data)
        made.createdAt = made.updatedAt = daysAgo(40 - n * 3);
        if (n === 2 || n === 5 || n === 9) {                      // a few finished (past) projects
            // mark this one as a PAST project
            made.projectStatus = IDPStatus.PAST;
            // and give it a completion date
            made.completedAt = daysAgo(5 + n);
        }
    });

    // Company profiles for some other designers (the default "designer" creates their own - US13)
    const companies = [['Nordhaus Interiors', '201912345A', 'Scandinavian-inspired HDB and condo renovations'],
                       // demo company
                       ['Terra & Teak', '202001234B', 'Warm, natural-material interiors for landed homes'],
                       // demo company
                       ['Blockform Studio', '202155555C', 'Bold, modern space planning for small units']];
    // for each demo company...
    companies.forEach(([name, reg, desc], n) => {
        // ...pick a designer for it (designers 2, 3, 4)
        const d = designers[n + 1];
        // ...if that designer exists, save the company profile for them...
        if (d) new CompanyProfile().saveCompanyProfile(d.userId, name, reg, desc,
            // ...with a made-up email (e.g. hello@nordhausinteriors.sg) and an 8-digit phone number
            `hello@${name.toLowerCase().replace(/[^a-z]/g, '')}.sg`, `6${String(1000000 + n * 2345671).slice(0, 7)}`);
    });

    // Back-date the test accounts a little so reports cover more than one day
    UserAccount.accounts.forEach((a, n) => { a.createdAt = daysAgo(45 - (n % 45)); });

    // Customer views over the last 30 days (US37 view counts, reports)
    const customers = UserAccount.accounts.filter(a => a.profileId === 3 && a.accountStatus === 'Active');
    // for each of the last 30 days...
    for (let day = 0; day < 30; day++) {
        // ...record 1 to 4 IDP views
        for (let k = 0; k < 1 + (day % 4); k++) {
            // pick an IDP to be viewed
            const target = IDP.idps[(day * 3 + k) % IDP.idps.length];
            // record a view by one of the customers
            IDPViewRecord.recordView(target.idpId, customers[(day + k) % customers.length].userId);
            // set the view's date to that day
            IDPViewRecord.records[IDPViewRecord.records.length - 1].viewedAt = daysAgo(day);
        }
    }

}
