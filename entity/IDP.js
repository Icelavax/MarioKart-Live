export const IDPStatus = Object.freeze({ CURRENT: 'Current', PAST: 'Past' });

// <<Entity>> IDP (Interior Design Project) - one shared class for every IDP story
export default class IDP {
    static idps = [];

    idpId; designerId; categoryId; title; description; designStyle;
    projectStatus; imageUrl; createdAt; updatedAt; completedAt;

    // US20 +createIDP(designerId: Integer, categoryId: Integer, title: String, description: String): Boolean
    createIDP(designerId, categoryId, title, description) {
        if (designerId == null || !Number.isInteger(categoryId)) return false;
        if (typeof title !== 'string' || title.trim() === '') return false;
        if (typeof description !== 'string' || description.trim() === '') return false;

        const now = new Date().toISOString();
        const idp = new IDP();
        idp.idpId = IDP.idps.length + 1;
        idp.designerId = designerId;
        idp.categoryId = categoryId;
        idp.title = title.trim();
        idp.description = description.trim();
        idp.designStyle = '';
        idp.projectStatus = IDPStatus.CURRENT;
        idp.imageUrl = '';
        idp.createdAt = now;
        idp.updatedAt = now;
        idp.completedAt = null;
        IDP.idps.push(idp);
        return true;
    }

    // UI support (not a user story): the IDP tiles shown on the dashboard
    static getAllIDPs() { return [...IDP.idps]; }
}
