import ViewCurrentIDPController from '../control/ViewCurrentIDPController.js';
import { IDPStatus } from '../entity/IDP.js';
import { Session } from './Session.js';

// <<Boundary>> ViewCurrentIDPPage - US21 View Current IDP
export default class ViewCurrentIDPPage {
    output = null;

    // +selectIDP(idpId: Integer): void
    selectIDP(idpId) {
        const idp = new ViewCurrentIDPController().viewIDP(idpId);
        // [IDP found and accessible]: it exists, belongs to this designer and is a current IDP
        const accessible = idp != null && idp.designerId === Session.userId
            && idp.projectStatus === IDPStatus.CURRENT;
        if (accessible) this.displayIDPDetails(idp);
        else this.displayFailure();                      // [IDP not found / access denied]
    }

    // +displayIDPDetails(idp: IDP): void
    displayIDPDetails(idp) { this.#show('data', 'IDP details', { ...idp }); }

    // +displayFailure(): void
    displayFailure() { this.#show('failure', 'IDP not found or cannot be accessed'); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[ViewCurrentIDPPage] ${message ?? ''}`, data ?? '');
    }
}
