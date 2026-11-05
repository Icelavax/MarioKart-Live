import IDP from './IDP.js';

// <<Entity>> SavedIDP - an IDP a customer saved (their shortlist)
export default class SavedIDP {
    static saved = [];

    customerId; idpId; savedDate;

    // US32 +saveIDP(customerId: Integer, idpId: Integer): Boolean
    // false if this customer already saved this IDP, or the IDP does not exist.
    // Saving also counts as one shortlist for the IDP (US38).
    saveIDP(customerId, idpId) {
        const idp = IDP.idps.find(i => i.idpId === idpId);
        if (!idp) return false;
        if (SavedIDP.saved.some(s => s.customerId === customerId && s.idpId === idpId)) return false;
        const record = new SavedIDP();
        record.customerId = customerId;
        record.idpId = idpId;
        record.savedDate = new Date().toISOString();
        SavedIDP.saved.push(record);
        idp.shortlistCount += 1;
        return true;
    }

    // US33 +searchSavedIDP(customerId: Integer, title: String): List<IDP>
    // The customer's saved IDPs whose title contains the text (any case)
    searchSavedIDP(customerId, title) {
        const t = String(title ?? '').trim().toLowerCase();
        return SavedIDP.#savedIDPsOf(customerId).filter(i => i.title.toLowerCase().includes(t));
    }

    // US34 +viewSavedIDP(customerId: Integer, idpId: Integer): IDP
    // null if the IDP is not in this customer's saved list
    viewSavedIDP(customerId, idpId) {
        return SavedIDP.#savedIDPsOf(customerId).find(i => i.idpId === idpId) ?? null;
    }

    static #savedIDPsOf(customerId) {
        return SavedIDP.saved
            .filter(s => s.customerId === customerId)
            .map(s => IDP.idps.find(i => i.idpId === s.idpId))
            .filter(Boolean);                       // skip IDPs deleted since they were saved
    }

    // UI support (not a user story): the customer's saved list screen
    static getSavedIDPs(customerId) { return SavedIDP.#savedIDPsOf(customerId); }
}
