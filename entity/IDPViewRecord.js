// <<Entity>> IDPViewRecord - one record each time a customer views an IDP
export default class IDPViewRecord {
    static records = [];

    viewRecordId; idpId; customerId; viewedAt;

    // US37 +getViewCount(idpId: Integer): Integer
    // -1 when the views cannot be retrieved (invalid idpId)
    getViewCount(idpId) {
        if (!Number.isInteger(idpId) || idpId < 1) return -1;
        return IDPViewRecord.records.filter(r => r.idpId === idpId).length;
    }

    // Not in any diagram: records one view when a customer opens an IDP (US31), so that
    // US37 (view count) and the reports have real data. Called by the web UI only.
    static recordView(idpId, customerId) {
        const viewRecordId = Math.max(0, ...IDPViewRecord.records.map(r => r.viewRecordId)) + 1;
        IDPViewRecord.records.push({ viewRecordId, idpId, customerId, viewedAt: new Date().toISOString() });
    }
}
