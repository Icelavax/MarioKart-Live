# CSIT314 Team Mario Kart – ID Platform

An Interior Design (IDP) platform built with the **BCE** (Boundary – Control – Entity) pattern
in Node.js, with an Express web UI and a PostgreSQL database hosted on Neon.
The live site is deployed on Render from `sprint4/`.

## Code by sprint

Each folder holds the full, runnable code as it stood at the end of that sprint.

| Folder | Sprint | User stories | Developer |
|---|---|---|---|
| [`sprint1/`](sprint1) | Sprint 1 | US1, US6, US11, US12, US13, US18, US19, US20, US35, US36, US39, US47, US48 | Shi Mun |
| [`sprint2/`](sprint2) | Sprint 2 | US2, US3, US7, US8, US14, US15, US21, US22, US25, US26, US27, US31, US40, US41 | Shi Mun |
| [`sprint3/`](sprint3) | Sprint 3 | US4, US5, US9, US10, US16, US17, US23, US24, US28, US29, US30, US37, US38, US42, US43 | Zhi Xiang |
| [`sprint4/`](sprint4) | Sprint 4 (live) | US32, US33, US34, US44, US45, US46 | Zhi Xiang |

<<<<<<< HEAD
## Sprint timeline

| Sprint | Start | End | Folder |
|---|---|---|---|
| Sprint 1 | 16 Oct 2026 | 23 Oct 2026 | `sprint1/` |
| Sprint 2 | 23 Oct 2026 | 30 Oct 2026 | `sprint2/` |
| Sprint 3 | 30 Oct 2026 | 06 Nov 2026 | `sprint3/` |
| Sprint 4 | 06 Nov 2026 | 10 Nov 2026 | `sprint4/` |

> **Note on commit dates:** the four sprint commits ("Sprint 1 – …" to "Sprint 4 – …") were
> re-dated to the end of each sprint, with the lecturer's approval, because the sprint code was
> committed to this repository after development. They were actually committed on 11 Nov 2026.
> Per-story progress and dates are tracked in Taiga.

## Folder layout (inside each sprint)

```
boundary/   UI pages + field validation   (<<Boundary>>)
control/    one controller per user story (<<Control>>)
entity/     data classes                  (<<Entity>>)
database/   schema, test data, Neon connection (db.js)
web/        Express views and styles
test.js     unit tests
```

## Run a sprint

```
cd sprint4
npm install
npm start      # http://localhost:3000
npm test       # unit tests
```

TDD tests (Sprint 1 login/logout) are in `sprint4/tdd/`:

=======
## Folder layout (inside each sprint)

```
boundary/   UI pages + field validation   (<<Boundary>>)
control/    one controller per user story (<<Control>>)
entity/     data classes                  (<<Entity>>)
database/   schema, test data, Neon connection (db.js)
web/        Express views and styles
test.js     unit tests
```

## Run a sprint

```
cd sprint4
npm install
npm start      # http://localhost:3000
npm test       # unit tests
```

TDD tests (Sprint 1 login/logout) are in `sprint4/tdd/`:

>>>>>>> 0c039a900198c986f9ffa182e38641714a0971a3
```
cd sprint4
npm run test:sprint1
```

## CI/CD

- **GitHub Actions** (`MarioKart CI`) runs the unit tests in `sprint4/` on every push.
- **Render** redeploys `sprint4/` automatically after each push to `main`.
