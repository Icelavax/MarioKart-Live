// ==========================================================================
// PRESENTATION NOTE
// <<Entity>> IDPViewRecord - one record each time a customer views an IDP
//
// Used by: US37.
// What to say: The entity holds the data and the business rules that need stored data (duplicate
//              checks, status checks, counts). Each user story calls its own method here through
//              its controller.
//
// Q: Where is the SQL? I do not see any queries here.
// A: The entity works on its in-memory list. database/db.js loads every table from Neon at
//    start-up and saves each change back in one transaction. This keeps the entity classes the
//    same as our BCE diagram and easy to unit test.
// ==========================================================================

// <<Entity>> IDPViewRecord - one record each time a customer views an IDP
// ENTITY class IDPViewRecord: holds the data and the business rules that need stored data
export default class IDPViewRecord {
    // every IDP view is kept in this list (loaded from the database at start-up)
    static records = [];

    // the fields of one view record: which IDP, which customer, when
    viewRecordId; idpId; customerId; viewedAt;

    // US37 +getViewCount(idpId: Integer): Integer
    // -1 when the views cannot be retrieved (invalid idpId)
    getViewCount(idpId) {
        // the IDP ID is not a valid positive number -> return -1 (the page shows an error)
        if (!Number.isInteger(idpId) || idpId < 1) return -1;
        // count how many view records belong to this IDP
        return IDPViewRecord.records.filter(r => r.idpId === idpId).length;
    }

    // Not in any diagram: records one view when a customer opens an IDP (US31), so that
    // US37 (view count) and the reports have real data. Called by the web UI only.
    static recordView(idpId, customerId) {
        // new ID = biggest existing ID + 1
        const viewRecordId = Math.max(0, ...IDPViewRecord.records.map(r => r.viewRecordId)) + 1;
        // save a view record for this IDP, this customer, now
        IDPViewRecord.records.push({ viewRecordId, idpId, customerId, viewedAt: new Date().toISOString() });
    }
}
