// ==========================================================================
// PRESENTATION NOTE
// <<Entity>> IDP (Interior Design Project) - one shared class for every IDP story
//
// Used by: US20, US21, US22, US23, US24, US25, US26, US27, US28, US29, US30, US31, US38.
// What to say: The entity holds the data and the business rules that need stored data (duplicate
//              checks, status checks, counts). Each user story calls its own method here through
//              its controller.
//
// Q: Where is the SQL? I do not see any queries here.
// A: The entity works on its in-memory list. database/db.js loads every table from Neon at
//    start-up and saves each change back in one transaction. This keeps the entity classes the
//    same as our BCE diagram and easy to unit test.
// ==========================================================================

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

    // US21 / US26 / US31 +viewIDP(idpId: Integer): IDP
    viewIDP(idpId) {
        // return the IDP with this ID, or null if there is none
        return IDP.idps.find(i => i.idpId === idpId) ?? null;
    }

    // US25 +updateIDPStatus(idpId: Integer, status: String): Boolean
    // Status value is validated by the boundary (UpdateIDPStatusPage.validateInput).
    // false if the IDP does not exist
    updateIDPStatus(idpId, status) {
        // find the IDP with this ID
        const idp = IDP.idps.find(i => i.idpId === idpId);
        // not found -> report failure
        if (!idp) return false;
        // change its status (Current or Past)
        idp.projectStatus = status;
        // record when it was changed
        idp.updatedAt = new Date().toISOString();
        // if it is now Past, remember the completion date; otherwise clear it
        idp.completedAt = status === IDPStatus.PAST ? idp.updatedAt : null;
        // success
        return true;
    }

    // US24 +searchIDP(keyword: String, categoryId: Integer): List<IDP>
    // US30 +searchIDP(criteria: String): IDP[]
    // One method for both stories (JavaScript has no overloading): US30 passes only the
    // criteria, US24 also passes a category. Matches title, description or design style;
    // categoryId (optional) narrows to one category.
    searchIDP(keyword, categoryId) {
        // tidy the keyword: turn null into '', trim spaces, make lower-case (so search ignores case)
        const k = String(keyword ?? '').trim().toLowerCase();
        // return every IDP where...
        return IDP.idps.filter(i =>
            // ...there is no keyword, or the title or description contains it...
            (k === '' || i.title.toLowerCase().includes(k) || i.description.toLowerCase().includes(k)
                // ...or the design style contains it...
                || (i.designStyle ?? '').toLowerCase().includes(k))
            // ...AND (no category was picked, or it is in the picked category)
            && (categoryId == null || i.categoryId === categoryId));
    }

    // US22 / US27 +updateIDP(idpId: Integer, title: String, description: String,
    //                        designStyle: String, categoryId: Integer): Boolean
    // Keeps the project's status (Current stays Current, Past stays Past); updates the timestamp.
    // Fields are validated by the boundary. false if the IDP does not exist.
    updateIDP(idpId, title, description, designStyle, categoryId) {
        // find the IDP with this ID
        const idp = IDP.idps.find(i => i.idpId === idpId);
        // not found -> report failure
        if (!idp) return false;
        // save the title
        idp.title = title;
        // save the description
        idp.description = description;
        // overwrite the design style (blank if none)
        idp.designStyle = designStyle ?? '';
        // the category it belongs to
        idp.categoryId = categoryId;
        // record when it was changed
        idp.updatedAt = new Date().toISOString();
        // success
        return true;
    }

    // US23 +deleteIDP(idpId: Integer): Boolean   (false if the IDP does not exist)
    // BCE method deleteIDP() (gets: idpId): called by the controller
    deleteIDP(idpId) {
        // find where this IDP sits in the list (-1 = not found)
        const index = IDP.idps.findIndex(i => i.idpId === idpId);
        // not found -> nothing to delete, report failure
        if (index === -1) return false;
        // remove 1 item at that position = delete the IDP
        IDP.idps.splice(index, 1);
        // success
        return true;
    }

    // US38 +getShortlistCount(idpID: int): int   (-1 if the IDP does not exist)
    // BCE method getShortlistCount() (gets: idpID): called by the controller
    getShortlistCount(idpID) {
        // find the IDP with this ID
        const idp = IDP.idps.find(i => i.idpId === idpID);
        // return how many customers saved it, or -1 if the IDP does not exist
        return idp ? idp.shortlistCount : -1;
    }

    // UI support (not a user story): the IDP tiles shown on the dashboard
    // UI support: give a copy of all IDPs (for the dashboard tiles)
    static getAllIDPs() { return [...IDP.idps]; }
}

// A category that IDPs still use cannot be deleted (US42)
IDPCategory.inUse = categoryId => IDP.idps.some(i => i.categoryId === categoryId);
