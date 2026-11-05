import IDPCategory from './IDPCategory.js';

export const IDPStatus = Object.freeze({ CURRENT: 'Current', PAST: 'Past' });

// <<Entity>> IDP (Interior Design Project) - one shared class for every IDP story
export default class IDP {
    static idps = [];

    idpId; designerId; categoryId; title; description; designStyle;
    projectStatus; imageUrl; createdAt; updatedAt; completedAt; shortlistCount = 0;

    // US20 +createIDP(designerId: Integer, categoryId: Integer, title: String, description: String): Boolean
    // Fields are validated by the boundary (CreateCurrentIDPPage.validateInput)
    createIDP(designerId, categoryId, title, description) {

        const now = new Date().toISOString();
        const idp = new IDP();
        idp.idpId = Math.max(0, ...IDP.idps.map(i => i.idpId)) + 1;
        idp.designerId = designerId;
        idp.categoryId = categoryId;
        idp.title = title;
        idp.description = description;
        idp.designStyle = '';
        idp.projectStatus = IDPStatus.CURRENT;
        idp.imageUrl = '';
        idp.createdAt = now;
        idp.updatedAt = now;
        idp.completedAt = null;
        IDP.idps.push(idp);
        return true;
    }

    // US21 / US26 / US31 +viewIDP(idpId: Integer): IDP
    viewIDP(idpId) {
        return IDP.idps.find(i => i.idpId === idpId) ?? null;
    }

    // US25 +updateIDPStatus(idpId: Integer, status: String): Boolean
    // Status value is validated by the boundary (UpdateIDPStatusPage.validateInput).
    // false if the IDP does not exist
    updateIDPStatus(idpId, status) {
        const idp = IDP.idps.find(i => i.idpId === idpId);
        if (!idp) return false;
        idp.projectStatus = status;
        idp.updatedAt = new Date().toISOString();
        idp.completedAt = status === IDPStatus.PAST ? idp.updatedAt : null;
        return true;
    }

    // US24 +searchIDP(keyword: String, categoryId: Integer): List<IDP>
    // US30 +searchIDP(criteria: String): IDP[]
    // One method for both stories (JavaScript has no overloading): US30 passes only the
    // criteria, US24 also passes a category. Matches title, description or design style;
    // categoryId (optional) narrows to one category.
    searchIDP(keyword, categoryId) {
        const k = String(keyword ?? '').trim().toLowerCase();
        return IDP.idps.filter(i =>
            (k === '' || i.title.toLowerCase().includes(k) || i.description.toLowerCase().includes(k)
                || (i.designStyle ?? '').toLowerCase().includes(k))
            && (categoryId == null || i.categoryId === categoryId));
    }

    // US22 / US27 +updateIDP(idpId: Integer, title: String, description: String,
    //                        designStyle: String, categoryId: Integer): Boolean
    // Keeps the project's status (Current stays Current, Past stays Past); updates the timestamp.
    // Fields are validated by the boundary. false if the IDP does not exist.
    updateIDP(idpId, title, description, designStyle, categoryId) {
        const idp = IDP.idps.find(i => i.idpId === idpId);
        if (!idp) return false;
        idp.title = title;
        idp.description = description;
        idp.designStyle = designStyle ?? '';
        idp.categoryId = categoryId;
        idp.updatedAt = new Date().toISOString();
        return true;
    }

    // US23 +deleteIDP(idpId: Integer): Boolean   (false if the IDP does not exist)
    deleteIDP(idpId) {
        const index = IDP.idps.findIndex(i => i.idpId === idpId);
        if (index === -1) return false;
        IDP.idps.splice(index, 1);
        return true;
    }

    // US38 +getShortlistCount(idpID: int): int   (-1 if the IDP does not exist)
    getShortlistCount(idpID) {
        const idp = IDP.idps.find(i => i.idpId === idpID);
        return idp ? idp.shortlistCount : -1;
    }

    // UI support (not a user story): the IDP tiles shown on the dashboard
    static getAllIDPs() { return [...IDP.idps]; }
}

// A category that IDPs still use cannot be deleted (US42)
IDPCategory.inUse = categoryId => IDP.idps.some(i => i.categoryId === categoryId);
