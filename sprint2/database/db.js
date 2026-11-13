// ==========================================================================
// PRESENTATION NOTE
// database/db.js - connection to Neon PostgreSQL
//
// What to say: It reads DATABASE_URL (set on Render, never in code) and connects to Neon over
//              SSL. At start-up it loads every table into the entities; after each change it
//              saves everything inside BEGIN/COMMIT, and ROLLBACK if anything fails.
//
// Q: What is the downside of saving like this?
// A: Every save rewrites all tables, which is fine for our data size but would not scale. A
//    production version would use one SQL query per change (UPDATE ... WHERE id = $1).
// ==========================================================================

// Saves the data in a PostgreSQL database (e.g. a free Neon database), so it survives restarts.
//
// Only used when the DATABASE_URL environment variable is set (on Render: Environment -> Add variable).
// Without it the site runs exactly as before, with in-memory data that resets on restart.
//
// How it works: on start-up every table is loaded into the entity classes; after every change made
// through the website (any form POST), the tables are written back. The BCE classes are unchanged -
// the entities still hold the data while the site is running.
import pg from 'pg';
// bring in the UserProfile entity class (it holds and checks the user profile data)
import UserProfile from '../entity/UserProfile.js';
// bring in the UserAccount entity class (it holds and checks the user account data)
import UserAccount from '../entity/UserAccount.js';
// bring in the CompanyProfile entity class (it holds and checks the company profile data)
import CompanyProfile from '../entity/CompanyProfile.js';
// bring in the IDPCategory entity class (it holds and checks the idp category data)
import IDPCategory from '../entity/IDPCategory.js';
// bring in the IDP entity class (it holds and checks the idp data)
import IDP from '../entity/IDP.js';

// table name, the entity's array, the class to rebuild rows as, primary key, [column, attribute] pairs
const TABLES = [
    // user_profiles table <- UserProfile.profiles, primary key profile_id
    { table: 'user_profiles', rows: () => UserProfile.profiles, Cls: UserProfile, key: 'profile_id',
      // columns: [database column, entity field, type] (type is TEXT when not given)
      cols: [['profile_id', 'profileId', 'INTEGER'], ['profile_name', 'profileName'], ['description', 'description'],
             // ...continued
             ['profile_status', 'profileStatus'], ['created_at', 'createdAt']] },
    // user_accounts table <- UserAccount.accounts, primary key user_id
    { table: 'user_accounts', rows: () => UserAccount.accounts, Cls: UserAccount, key: 'user_id',
      // columns: [database column, entity field, type]
      cols: [['user_id', 'userId', 'INTEGER'], ['username', 'username'], ['email', 'email'], ['password_hash', 'passwordHash'],
             // ...continued
             ['full_name', 'fullName'], ['contact_number', 'contactNumber'], ['profile_id', 'profileId', 'INTEGER'],
             // ...continued
             ['account_status', 'accountStatus'], ['created_at', 'createdAt']] },
    // company_profiles table <- CompanyProfile.companies, primary key company_id
    { table: 'company_profiles', rows: () => CompanyProfile.companies, Cls: CompanyProfile, key: 'company_id',
      // columns: [database column, entity field, type]
      cols: [['company_id', 'companyId', 'INTEGER'], ['user_id', 'userId', 'INTEGER'], ['company_name', 'companyName'],
             // ...continued
             ['registration_number', 'registrationNumber'], ['company_description', 'companyDescription'],
             // ...continued
             ['contact_email', 'contactEmail'], ['contact_number', 'contactNumber']] },
    // idp_categories table <- IDPCategory.categories, primary key category_id
    { table: 'idp_categories', rows: () => IDPCategory.categories, Cls: IDPCategory, key: 'category_id',
      // columns: [database column, entity field, type]
      cols: [['category_id', 'categoryId', 'INTEGER'], ['category_name', 'categoryName'],
             // ...continued
             ['category_description', 'categoryDescription'], ['created_at', 'createdAt']] },
    // idps table <- IDP.idps, primary key idp_id
    { table: 'idps', rows: () => IDP.idps, Cls: IDP, key: 'idp_id',
      // columns: [database column, entity field, type]
      cols: [['idp_id', 'idpId', 'INTEGER'], ['designer_id', 'designerId', 'INTEGER'], ['category_id', 'categoryId', 'INTEGER'],
             // ...continued
             ['title', 'title'], ['description', 'description'], ['design_style', 'designStyle'],
             // ...continued
             ['project_status', 'projectStatus'], ['image_url', 'imageUrl'], ['created_at', 'createdAt'],
             // ...continued
             ['updated_at', 'updatedAt'], ['completed_at', 'completedAt'], ['shortlist_count', 'shortlistCount', 'INTEGER']] },
];

// read the database address from the DATABASE_URL setting (set on Render; never written in the code)
const url = process.env.DATABASE_URL;
// if there is an address, open a pool of database connections...
const pool = url ? new pg.Pool({
    // ...to that address
    connectionString: url,
    // use SSL (encrypted) for an online database like Neon; not needed for a local one
    ssl: /localhost|127\.0\.0\.1/.test(url) ? false : { rejectUnauthorized: false },
    // at most 3 connections at the same time (enough for the free plan)
    max: 3,
// no address -> no database (the site keeps data in memory only)
}) : null;

// true when a database is being used
export const enabled = pool != null;

// Creates the tables if they do not exist yet. Dates are kept as ISO text, exactly as the entities store them.
async function createTables(client) {
    // for each table in the list above...
    for (const t of TABLES) {
        // ...build the column list, e.g. "user_id INTEGER, username TEXT, ..."
        const cols = t.cols.map(([c, , type]) => `${c} ${type ?? 'TEXT'}`).join(', ');
        // ...and run CREATE TABLE IF NOT EXISTS with its primary key
        await client.query(`CREATE TABLE IF NOT EXISTS ${t.table} (${cols}, PRIMARY KEY (${t.key}))`);
    }
}

// Loads every table into the entity arrays. Returns false when the database is still empty.
export async function loadAll() {
    // borrow a connection from the pool
    const client = await pool.connect();
    // try the steps below; "finally" makes sure the connection is always given back
    try {
        // make sure the tables exist
        await createTables(client);
        // count the rows in user_accounts
        const { rows } = await client.query('SELECT COUNT(*)::int AS n FROM user_accounts');
        // empty database (first run) -> return false so server.js adds the starting data
        if (rows[0].n === 0) return false;
        // for each table in the list above...
        for (const t of TABLES) {
            // read every row of this table, sorted by its key
            const result = await client.query(`SELECT * FROM ${t.table} ORDER BY ${t.key}`);
            // the entity list this table goes into (e.g. UserAccount.accounts)
            const target = t.rows();
            // empty the list first
            target.length = 0;
            // for each row read from the database...
            for (const row of result.rows) {
                // ...make an entity object (a plain object for view records)
                const obj = t.Cls === Object ? {} : new t.Cls();
                // ...copy every column into the matching field (e.g. full_name -> fullName)
                for (const [col, attr] of t.cols) obj[attr] = row[col];
                // ...and add it to the list
                target.push(obj);
            }
        }
        // success
        return true;
    // whatever happens above:
    } finally {
        // give the connection back to the pool
        client.release();
    }
}

// Writes every entity array back to its table, in one transaction (the data set is small).
export async function saveAll() {
    // borrow a connection from the pool
    const client = await pool.connect();
    // try the steps below; "finally" makes sure the connection is always given back
    try {
        // start a transaction: either ALL of the changes below are saved, or none of them
        await client.query('BEGIN');
        // empty every table (in reverse order)
        for (const t of [...TABLES].reverse()) await client.query(`DELETE FROM ${t.table}`);
        // for each table in the list above...
        for (const t of TABLES) {
            // the entity list for this table
            const items = t.rows();
            // nothing in it -> go to the next table
            if (!items.length) continue;
            // the column names, e.g. "user_id, username, email"
            const names = t.cols.map(([c]) => c).join(', ');
            // values = all the values to insert; groups = one "($1, $2, ...)" per row
            const values = [], groups = [];
            // for each item in the list...
            items.forEach((item, i) => {
                // ...add a group of numbered placeholders for its values (prevents SQL injection)
                groups.push(`(${t.cols.map((_, j) => `$${i * t.cols.length + j + 1}`).join(', ')})`);
                // ...and add its values in column order (null if missing)
                for (const [, attr] of t.cols) values.push(item[attr] ?? null);
            });
            // insert all the rows of this table in one INSERT statement
            await client.query(`INSERT INTO ${t.table} (${names}) VALUES ${groups.join(', ')}`, values);
        }
        // everything worked -> save the changes for real
        await client.query('COMMIT');
    // something went wrong:
    } catch (err) {
        // undo everything since BEGIN, so the database is never half-saved
        await client.query('ROLLBACK').catch(() => {});
        // pass the error on so it is reported
        throw err;
    // whatever happens above:
    } finally {
        // give the connection back to the pool
        client.release();
    }
}

// Saves are queued one after another so two quick changes never overlap
let queue = Promise.resolve();
// ask for a save (server.js calls this after every form is submitted)
export function saveSoon() {
    // no database -> nothing to do
    if (!enabled) return;
    // add a save to the end of the queue; if it fails, print the error but keep the site running
    queue = queue.then(saveAll).catch(err => console.error('Database save failed:', err.message));
}
