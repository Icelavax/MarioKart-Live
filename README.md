# CSIT314 Team Mario Kart - Sprint 1 code

BCE code for every user story up to Sprint 1 that has **both** a BCE diagram and a
sequence diagram in the report. Sprint 1 contains all code from the earlier sprints.
No UI (waiting for wireframes) and no database yet - data is kept in memory.

## Run the tests
Needs Node.js 18+ only.
```
node test.js
```

## Run the web UI (Sprint 1)
```
npm install
npm start
```
Then open http://localhost:3000. Log in with a test account below (pick the matching User Profile).
Data is kept in memory, so it resets every time the server restarts.
Each browser has its own login session (cookie), so several people can use it at once.

`server.js` only passes form input to the boundary pages and shows `page.output`; all logic stays in
boundary -> control -> entity. Screens follow the Sprint 1 wireframes; where they differ, the BCE and
sequence diagrams win (e.g. the Create User Account form has a User Profile drop-down because
`submitForm(..., profileId)` needs one, and messages use the sequence-diagram wording).

## Folders
- `boundary/` - one Page class per user story (+ `Session.js`)
- `control/` - one Controller per user story (logout stories have none in the BCE)
- `entity/` - the only classes that store data
- `database/seed.js` - starting data (4 roles, test accounts, 1 category)
- `database/schema.sql` - SQL tables for later (not used yet)
- `server.js` + `web/` - the web UI (Sprint 1 screens)
- `database/demoData.js` - demo IDPs for the dashboard (UI only)

## Stories in this code (13)
| Story | Name | Owner | Added in |
|---|---|---|---|
| US1 | Create User Account | Zhi Xiang | Sprint 1 |
| US6 | Create User Profile | Zhi Xiang | Sprint 1 |
| US11 | User Admin Login | Shi Mun | Sprint 1 |
| US12 | User Admin Logout | Shi Mun | Sprint 1 |
| US13 | Create Company Profile | YiXuan | Sprint 1 |
| US18 | Interior Designer Login | Shi Mun | Sprint 1 |
| US19 | Interior Designer Logout | Shi Mun | Sprint 1 |
| US20 | Create Current IDP | Daril | Sprint 1 |
| US35 | Customer Login | Shi Mun | Sprint 1 |
| US36 | Customer Logout | Shi Mun | Sprint 1 |
| US39 | Create IDP Category | Shi Mun | Sprint 1 |
| US47 | Platform Manager Login | Shi Mun | Sprint 1 |
| US48 | Platform Manager Logout | Shi Mun | Sprint 1 |

## Not coded yet (no BCE / sequence diagram in the report)
- None

## How the pages work without a UI
- Method names, parameters and return types follow the BCE diagrams.
- Inputs that a BCE method does not take as a parameter (e.g. `clickLogin()`) come from the page's
  `form` object, which stands in for the input fields.
- Actor actions drawn in the sequence diagrams as plain text (e.g. "clicks Yes", "clicks Search")
  are coded as UI event methods under the comment `UI events` - they are not BCE methods.
- What a page displays is stored in `page.output`.

## Test accounts
| Role | Login page | Username / password |
|---|---|---|
| User Admin (profile 1) | `UserAdminLoginPage` | admin / admin |
| Interior Designer (profile 2) | `InteriorDesignerLoginPage` | designer / designer123 |
| Customer (profile 3) | `CustomerLoginPage` | customer / customer123 |
| Platform Manager (profile 4) | `PlatformManagerLoginPage` | manager / manager123 |
