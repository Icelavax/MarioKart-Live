// ==========================================================================
// PRESENTATION NOTE
// <<Entity>> SavedIDP - an IDP a customer saved (their shortlist)
//
// Used by: US32, US33, US34.
// What to say: The entity holds the data and the business rules that need stored data (duplicate
//              checks, status checks, counts). Each user story calls its own method here through
//              its controller.
//
// Q: Where is the SQL? I do not see any queries here.
// A: The entity works on its in-memory list. database/db.js loads every table from Neon at
//    start-up and saves each change back in one transaction. This keeps the entity classes the
//    same as our BCE diagram and easy to unit test.
// ==========================================================================

// bring in IDP so we can count IDPs created
import IDP from './IDP.js';

// <<Entity>> SavedIDP - an IDP a customer saved (their shortlist)
// ENTITY class SavedIDP: holds the data and the business rules that need stored data
export default class SavedIDP {
    // every saved IDP (customer + IDP) is kept in this list (loaded from the database at start-up)
    static saved = [];

    // the fields of one saved record: which customer, which IDP, when
    customerId; idpId; savedDate;

    // US32 +saveIDP(customerId: Integer, idpId: Integer): Boolean
    // false if this customer already saved this IDP, or the IDP does not exist.
    // Saving also counts as one shortlist for the IDP (US38).
    saveIDP(customerId, idpId) {
        // find the IDP with this ID
        const idp = IDP.idps.find(i => i.idpId === idpId);
        // not found -> report failure
        if (!idp) return false;
        // rule: a customer cannot save the same IDP twice -> fail if already saved
        if (SavedIDP.saved.some(s => s.customerId === customerId && s.idpId === idpId)) return false;
        // make a new saved record
        const record = new SavedIDP();
        // which customer saved it
        record.customerId = customerId;
        // which IDP was saved
        record.idpId = idpId;
        // when it was saved
        record.savedDate = new Date().toISOString();
        // add it to the list (so it is stored)
        SavedIDP.saved.push(record);
        // add 1 to that IDP's shortlist count (used by US38 View IDP Shortlists)
        idp.shortlistCount += 1;
        // success
        return true;
    }

    // US33 +searchSavedIDP(customerId: Integer, title: String): List<IDP>
    // The customer's saved IDPs whose title contains the text (any case)
    searchSavedIDP(customerId, title) {
        // tidy the title: turn null into '', trim spaces, make lower-case
        const t = String(title ?? '').trim().toLowerCase();
        // of this customer's saved IDPs, keep the ones whose title contains the search text
        return SavedIDP.#savedIDPsOf(customerId).filter(i => i.title.toLowerCase().includes(t));
    }

    // US34 +viewSavedIDP(customerId: Integer, idpId: Integer): IDP
    // null if the IDP is not in this customer's saved list
    viewSavedIDP(customerId, idpId) {
        // return this saved IDP of this customer, or null if they did not save it
        return SavedIDP.#savedIDPsOf(customerId).find(i => i.idpId === idpId) ?? null;
    }

    // private helper #savedIDPsOf() - only used inside this class
    static #savedIDPsOf(customerId) {
        // from all saved records...
        return SavedIDP.saved
            // ...keep only this customer's
            .filter(s => s.customerId === customerId)
            // ...and turn each record into the full IDP
            .map(s => IDP.idps.find(i => i.idpId === s.idpId))
            .filter(Boolean);                       // skip IDPs deleted since they were saved
    }

    // UI support (not a user story): the customer's saved list screen
    // UI support: give this customer's saved IDPs (for the Saved IDPs screen)
    static getSavedIDPs(customerId) { return SavedIDP.#savedIDPsOf(customerId); }
}
