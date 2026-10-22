// bring in IDPCategory so we can tell it how to check if a category is in use
import IDPCategory from './IDPCategory.js';

// the two possible project statuses: Current or Past (frozen = cannot be changed by mistake)
export const IDPStatus = Object.freeze({ CURRENT: 'Current', PAST: 'Past' });

// <<Entity>> IDP (Interior Design Project) - one shared class for every IDP story
// ENTITY class IDP: holds the data and the business rules that need stored data
export default class IDP {
    // all IDPs are kept in this list (loaded from the database at start-up)
    static idps = [];

    // the fields every IDP has...
    idpId; designerId; categoryId; title; description; designStyle;
    // ...continued: status, image, dates, and how many customers saved it
    projectStatus; imageUrl; createdAt; updatedAt; completedAt; shortlistCount = 0;

    // US20 +createIDP(designerId: Integer, categoryId: Integer, title: String, description: String): Boolean
    // Fields are validated by the boundary (CreateCurrentIDPPage.validateInput)
    createIDP(designerId, categoryId, title, description) {

        // the current date and time, as text (e.g. 2026-11-06T02:30:00Z)
        const now = new Date().toISOString();
        // make a new, empty IDP object
        const idp = new IDP();
        // new ID = biggest existing ID + 1 (or 1 if there are none)
        idp.idpId = Math.max(0, ...IDP.idps.map(i => i.idpId)) + 1;
        // the designer who created it
        idp.designerId = designerId;
        // the category it belongs to
        idp.categoryId = categoryId;
        // save the title
        idp.title = title;
        // save the description
        idp.description = description;
        // design style starts empty (can be set when updating)
        idp.designStyle = '';
        // a new IDP always starts as a CURRENT project
        idp.projectStatus = IDPStatus.CURRENT;
        // no image yet
        idp.imageUrl = '';
        // remember when it was created
        idp.createdAt = now;
        // last updated = created time for now
        idp.updatedAt = now;
        // not completed yet
        idp.completedAt = null;
        // add it to the list of IDPs (so it is stored)
        IDP.idps.push(idp);
        // success
        return true;
    }

    // UI support (not a user story): the IDP tiles shown on the dashboard
    // UI support: give a copy of all IDPs (for the dashboard tiles)
    static getAllIDPs() { return [...IDP.idps]; }
}

// A category that IDPs still use cannot be deleted (US42)
IDPCategory.inUse = categoryId => IDP.idps.some(i => i.categoryId === categoryId);
