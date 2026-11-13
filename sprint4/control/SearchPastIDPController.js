// ==========================================================================
// PRESENTATION NOTE
// US29 Search Past IDP - <<Control>> SearchPastIDPController
//
// What to say: The controller has one job: it takes the request from the boundary page and passes
//              it to IDP.searchIDP(), then hands the answer back. It has no screen and holds no
//              data.
//
// Q: Why have a controller if it only passes the call on?
// A: It keeps the screen and the data apart: the boundary never touches the entity directly. If
//    the business logic changes, only the controller and entity change, not the UI. That is the
//    BCE rule.
// ==========================================================================

// bring in the IDP entity class (it holds and checks the idp data), plus IDPStatus
import IDP, { IDPStatus } from '../entity/IDP.js';

// <<Control>> SearchPastIDPController - US29 Search Past IDP
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class SearchPastIDPController {
    // +searchIDP(keyword: String, categoryId: Integer): List<IDP>
    // Only PAST projects are returned (this story searches the past IDP listing).
    searchIDP(keyword, categoryId) {
        // ask the IDP entity for every IDP matching the keyword / category...
        return new IDP().searchIDP(keyword, categoryId)
            // ...then keep only the PAST projects
            .filter(i => i.projectStatus === IDPStatus.PAST);
    }
}
