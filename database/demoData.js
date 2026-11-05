// Demo data for the web UI only (the tests do not use it).
// Gives every screen something to show: categories, IDPs (current + past), company profiles,
// and - in later sprints - customer views and saved IDPs, spread over the last few weeks
// so the reports have data. Records are created through the entity methods where one exists.
import UserAccount from '../entity/UserAccount.js';
import IDPCategory from '../entity/IDPCategory.js';
import IDP, { IDPStatus } from '../entity/IDP.js';
import CompanyProfile from '../entity/CompanyProfile.js';
import IDPViewRecord from '../entity/IDPViewRecord.js';
import SavedIDP from '../entity/SavedIDP.js';

const daysAgo = n => { const d = new Date(); d.setDate(d.getDate() - n); d.setHours(10 + (n % 8), 15, 0, 0); return d.toISOString(); };

export function loadDemoData() {
    const category = new IDPCategory();
    [['Modern', 'Clean lines and neutral palettes'], ['Traditional', 'Classic and heritage interiors'],
     ['Minimalist', 'Less is more - open, uncluttered spaces'], ['Industrial', 'Raw materials, metal and concrete'],
     ['Kitchen', 'Kitchen renovation projects'], ['Bedroom', 'Bedroom makeovers']]
        .forEach(([name, desc]) => category.createCategory(name, desc));
    const cat = name => IDPCategory.getAllCategories().find(c => c.categoryName === name).categoryId;

    const designers = UserAccount.accounts.filter(a => a.profileId === 2 && a.accountStatus === 'Active');
    const idp = new IDP();
    const projects = [
        ['Japanese Modern', 'Modern', 'Clean Japanese lines with warm wood', 'Japandi'],
        ['Japanese Tatami', 'Traditional', 'Tatami bedroom with sliding doors', 'Japanese'],
        ['European Style', 'Traditional', 'Classic mouldings and soft colours', 'European'],
        ['Minimalist White', 'Minimalist', 'All-white open-plan living', 'Minimalist'],
        ['Art Deco Modern', 'Modern', 'Geometric patterns with brass accents', 'Art Deco'],
        ['Traditional Style', 'Traditional', 'Heritage furniture and rich timber', 'Peranakan'],
        ['Chinese Modern', 'Modern', 'Modern take on Chinese motifs', 'Oriental'],
        ['Wood Industrial', 'Industrial', 'Raw wood with black steel', 'Industrial'],
        ['Compact HDB Kitchen', 'Kitchen', 'Space-saving kitchen for a 4-room flat', 'Scandinavian'],
        ['Cosy Master Bedroom', 'Bedroom', 'Warm lighting and built-in wardrobes', 'Contemporary'],
    ];
    projects.forEach(([title, c, desc, style], n) => {
        const owner = n < 6 ? designers[0] : designers[(n % (designers.length - 1)) + 1] ?? designers[0];
        idp.createIDP(owner.userId, cat(c), title, desc);
        const made = IDP.idps[IDP.idps.length - 1];
        made.designStyle = style;
        made.createdAt = made.updatedAt = daysAgo(40 - n * 3);
        if (n === 2 || n === 5 || n === 9) {                      // a few finished (past) projects
            made.projectStatus = IDPStatus.PAST;
            made.completedAt = daysAgo(5 + n);
        }
    });

    // Company profiles for some other designers (the default "designer" creates their own - US13)
    const companies = [['Nordhaus Interiors', '201912345A', 'Scandinavian-inspired HDB and condo renovations'],
                       ['Terra & Teak', '202001234B', 'Warm, natural-material interiors for landed homes'],
                       ['Blockform Studio', '202155555C', 'Bold, modern space planning for small units']];
    companies.forEach(([name, reg, desc], n) => {
        const d = designers[n + 1];
        if (d) new CompanyProfile().saveCompanyProfile(d.userId, name, reg, desc,
            `hello@${name.toLowerCase().replace(/[^a-z]/g, '')}.sg`, `6${String(1000000 + n * 2345671).slice(0, 7)}`);
    });

    // Back-date the test accounts a little so reports cover more than one day
    UserAccount.accounts.forEach((a, n) => { a.createdAt = daysAgo(45 - (n % 45)); });

    // Customer views over the last 30 days (US37 view counts, reports)
    const customers = UserAccount.accounts.filter(a => a.profileId === 3 && a.accountStatus === 'Active');
    for (let day = 0; day < 30; day++) {
        for (let k = 0; k < 1 + (day % 4); k++) {
            const target = IDP.idps[(day * 3 + k) % IDP.idps.length];
            IDPViewRecord.recordView(target.idpId, customers[(day + k) % customers.length].userId);
            IDPViewRecord.records[IDPViewRecord.records.length - 1].viewedAt = daysAgo(day);
        }
    }

    // Saved IDPs (US32-34, US38 shortlist counts, reports). The default "customer" starts with two saved.
    const saver = new SavedIDP();
    customers.forEach((c, n) => {
        [n % IDP.idps.length, (n * 3 + 1) % IDP.idps.length].forEach((i, j) => {
            if (saver.saveIDP(c.userId, IDP.idps[i].idpId)) SavedIDP.saved[SavedIDP.saved.length - 1].savedDate = daysAgo((n * 2 + j) % 20);
        });
    });
}
