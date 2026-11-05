import ViewPastIDPController from '../control/ViewPastIDPController.js';
import { IDPStatus } from '../entity/IDP.js';
import { Session } from './Session.js';

// <<Boundary>> ViewPastIDPPage - US26 View Past IDP
export default class ViewPastIDPPage {
    output = null;

    // +selectIDP(idpId: Integer): void
    selectIDP(idpId) {
        const idp = new ViewPastIDPController().viewIDP(idpId);
        // [IDP found and accessible]: it exists, belongs to this designer and is a past IDP
        const accessible = idp != null && idp.designerId === Session.userId
            && idp.projectStatus === IDPStatus.PAST;
        if (accessible) this.displayIDPDetails(idp);
        else this.displayFailure();                      // [IDP not found / access denied]
    }

    // +displayIDPDetails(idp: IDP): void
    displayIDPDetails(idp) { this.#show('data', 'IDP details', { ...idp }); }

    // +displayFailure(): void
    displayFailure() { this.#show('failure', 'IDP not found or cannot be accessed'); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[ViewPastIDPPage] ${message ?? ''}`, data ?? '');
    }
}
