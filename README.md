# CSIT314 Team Mario Kart - Sprint 4 code

BCE code for every user story up to Sprint 4 that has **both** a BCE diagram and a
sequence diagram in the report. Sprint 4 contains all code from the earlier sprints.
Includes a web UI for these stories. No database yet - data is kept in memory.

## Run the tests
Needs Node.js 18+ only.
```
node test.js
```

## Run the web UI
```
npm install
npm start
```
Then open http://localhost:3000. Log in with a test account below (pick the matching User Profile).
The site has screens for every story in this sprint folder (and nothing from later sprints).
Without a database, data is kept in memory and resets every time the server restarts.
To keep data, set `DATABASE_URL` to a PostgreSQL connection string (e.g. a free Neon database):
the tables are created and filled with the test data on the first start, and every change
made through the website is saved (see `database/db.js`).
Each browser has its own login session (cookie), so several people can use it at once.

`server.js` only passes form input to the boundary pages, calls the BCE methods / UI events in the
order of the sequence diagram, and shows `page.output`; all logic and field validation stay in
boundary -> control -> entity. Sprint 1 screens follow the Sprint 1 wireframes; later screens use the
same look. Where a wireframe and a diagram differ, the BCE and sequence diagrams win.
Confirmation pop-ups (Yes / No) are the `displayConfirmation()` steps in the sequence diagrams.

## Folders
- `boundary/` - one Page class per user story (+ `Session.js`, `Validator.js` field rules)
- `control/` - one Controller per user story (logout stories have none in the BCE)
- `entity/` - the only classes that store data
- `database/seed.js` - starting data (4 roles, Sprint 1 test accounts, 1 category)
- `database/testData.js` / `testData.csv` - the test data (see below)
- `database/schema.sql` - SQL tables for later (not used yet)
- `server.js` + `web/` - the web UI (Sprint 1 screens)
- `web/stories.js` - which stories this folder has (the UI only shows those)
- `database/demoData.js` - demo categories, IDPs, company profiles, views and saves (UI only)

## Stories in this code (46)
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
| US2 | View User Account | Zhi Xiang | Sprint 2 |
| US3 | Update User Account | Zhi Xiang | Sprint 2 |
| US7 | View User Profile | Zhi Xiang | Sprint 2 |
| US8 | Update User Profile | Zhi Xiang | Sprint 2 |
| US14 | View Company Profile | YiXuan | Sprint 2 |
| US21 | View Current IDP | Daril | Sprint 2 |
| US25 | Update IDP Status | Kei Hong | Sprint 2 |
| US26 | View Past IDP | Kei Hong | Sprint 2 |
| US31 | View IDP | Cheng Yong | Sprint 2 |
| US40 | View IDP Category | Shi Mun | Sprint 2 |
| US15 | Update Company Profile | YiXuan | Sprint 2 |
| US22 | Update Current IDP | Daril | Sprint 2 |
| US27 | Update Past IDP | Kei Hong | Sprint 2 |
| US41 | Update IDP Category | Shi Mun | Sprint 2 |
| US4 | Suspend User Account | Zhi Xiang | Sprint 3 |
| US5 | Search User Account | Zhi Xiang | Sprint 3 |
| US9 | Delete User Profile | Zhi Xiang | Sprint 3 |
| US10 | Search User Profile | Zhi Xiang | Sprint 3 |
| US30 | Search IDP | Cheng Yong | Sprint 3 |
| US37 | View IDP Views | Shi Mun | Sprint 3 |
| US16 | Delete Company Profile | YiXuan | Sprint 3 |
| US17 | Search Company Profile | YiXuan | Sprint 3 |
| US23 | Delete Current IDP | Daril | Sprint 3 |
| US24 | Search Current IDP | Daril | Sprint 3 |
| US38 | View IDP Shortlists | Shi Mun | Sprint 3 |
| US42 | Delete IDP Category | Shi Mun | Sprint 3 |
| US43 | Search IDP Category | Shi Mun | Sprint 3 |
| US32 | Save IDP | Cheng Yong | Sprint 4 |
| US33 | Search Saved IDP | Cheng Yong | Sprint 4 |
| US34 | View Saved IDP | Cheng Yong | Sprint 4 |
| US44 | Generate Daily Report | Shi Mun | Sprint 4 |
| US45 | Generate Weekly Report | Shi Mun | Sprint 4 |
| US46 | Generate Monthly Report | Shi Mun | Sprint 4 |

## Not coded yet (no BCE / sequence diagram in the report)
- Sprint 3: US28 Delete Past IDP, US29 Search Past IDP (the Sprint 3 report has no BCE / sequence diagram for them yet)

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

The other 20 Sprint 1 test accounts all use password `Pass1234` (list in `database/testData.js`).

## Test data (100 accounts, 4 batches of 25)
All 100 are listed in `database/testData.csv` (column `sprintBatch`).
- **Sprint 1 batch (userId 1-25)** - added in code: `database/testData.js`, loaded by `seed()`.
  `test.js` checks this batch first (TDD): 25 accounts, IDs 1-25, no duplicate usernames/emails,
  every role present, every account passes the form rules, and each one can log in through its own
  role's login page (the suspended one cannot).
- **Sprint 2, 3, 4 batches (userId 26-100)** - entered through the website's Create User Account form.

## Where validation happens
All data-field validation (required fields, min lengths, email / contact number format, a profile
must be picked) is in the **boundary** classes, using the rules in `boundary/Validator.js`.
A form with a bad field shows a specific message and never calls the controller.
Entities only reject what needs the stored data: duplicate username / email / profile name /
category name, record not found, account suspended, one company profile per designer.
