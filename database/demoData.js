// Demo data for the web UI only (the tests do not use it).
// Adds the IDP tiles shown on the dashboard in the wireframes.
// Everything is created through the entity methods, like real user input.
import IDPCategory from '../entity/IDPCategory.js';
import IDP from '../entity/IDP.js';

export function loadDemoData() {
    const category = new IDPCategory();
    ['Modern', 'Traditional', 'Minimalist', 'Industrial'].forEach(name =>
        category.createCategory(name, `${name} interior designs`));
    const id = name => IDPCategory.getAllCategories().find(c => c.categoryName === name).categoryId;

    const designerId = 2;   // the seeded "designer" account
    const idp = new IDP();
    [
        ['Japanese Modern', 'Modern', 'Clean Japanese lines with warm wood'],
        ['Japanese Tatami', 'Traditional', 'Tatami bedroom with sliding doors'],
        ['European Style', 'Traditional', 'Classic mouldings and soft colours'],
        ['Minimalist White', 'Minimalist', 'All-white open-plan living'],
        ['Art Deco Modern', 'Modern', 'Geometric patterns with brass accents'],
        ['Traditional Style', 'Traditional', 'Heritage furniture and rich timber'],
        ['Chinese Modern', 'Modern', 'Modern take on Chinese motifs'],
        ['Wood Industrial', 'Industrial', 'Raw wood with black steel'],
    ].forEach(([title, cat, desc]) => idp.createIDP(designerId, id(cat), title, desc));
}
