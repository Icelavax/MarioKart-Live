// Saves the data in a PostgreSQL database (e.g. a free Neon database), so it survives restarts.
//
// Only used when the DATABASE_URL environment variable is set (on Render: Environment -> Add variable).
// Without it the site runs exactly as before, with in-memory data that resets on restart.
//
// How it works: on start-up every table is loaded into the entity classes; after every change made
// through the website (any form POST), the tables are written back. The BCE classes are unchanged -
// the entities still hold the data while the site is running.
import pg from 'pg';
import UserProfile from '../entity/UserProfile.js';
import UserAccount from '../entity/UserAccount.js';
import CompanyProfile from '../entity/CompanyProfile.js';
import IDPCategory from '../entity/IDPCategory.js';
import IDP from '../entity/IDP.js';
import IDPViewRecord from '../entity/IDPViewRecord.js';
import SavedIDP from '../entity/SavedIDP.js';

// table name, the entity's array, the class to rebuild rows as, primary key, [column, attribute] pairs
const TABLES = [
    { table: 'user_profiles', rows: () => UserProfile.profiles, Cls: UserProfile, key: 'profile_id',
      cols: [['profile_id', 'profileId', 'INTEGER'], ['profile_name', 'profileName'], ['description', 'description'],
             ['profile_status', 'profileStatus'], ['created_at', 'createdAt']] },
    { table: 'user_accounts', rows: () => UserAccount.accounts, Cls: UserAccount, key: 'user_id',
      cols: [['user_id', 'userId', 'INTEGER'], ['username', 'username'], ['email', 'email'], ['password_hash', 'passwordHash'],
             ['full_name', 'fullName'], ['contact_number', 'contactNumber'], ['profile_id', 'profileId', 'INTEGER'],
             ['account_status', 'accountStatus'], ['created_at', 'createdAt']] },
    { table: 'company_profiles', rows: () => CompanyProfile.companies, Cls: CompanyProfile, key: 'company_id',
      cols: [['company_id', 'companyId', 'INTEGER'], ['user_id', 'userId', 'INTEGER'], ['company_name', 'companyName'],
             ['registration_number', 'registrationNumber'], ['company_description', 'companyDescription'],
             ['contact_email', 'contactEmail'], ['contact_number', 'contactNumber']] },
    { table: 'idp_categories', rows: () => IDPCategory.categories, Cls: IDPCategory, key: 'category_id',
      cols: [['category_id', 'categoryId', 'INTEGER'], ['category_name', 'categoryName'],
             ['category_description', 'categoryDescription'], ['created_at', 'createdAt']] },
    { table: 'idps', rows: () => IDP.idps, Cls: IDP, key: 'idp_id',
      cols: [['idp_id', 'idpId', 'INTEGER'], ['designer_id', 'designerId', 'INTEGER'], ['category_id', 'categoryId', 'INTEGER'],
             ['title', 'title'], ['description', 'description'], ['design_style', 'designStyle'],
             ['project_status', 'projectStatus'], ['image_url', 'imageUrl'], ['created_at', 'createdAt'],
             ['updated_at', 'updatedAt'], ['completed_at', 'completedAt'], ['shortlist_count', 'shortlistCount', 'INTEGER']] },
    { table: 'idp_view_records', rows: () => IDPViewRecord.records, Cls: Object, key: 'view_record_id',
      cols: [['view_record_id', 'viewRecordId', 'INTEGER'], ['idp_id', 'idpId', 'INTEGER'],
             ['customer_id', 'customerId', 'INTEGER'], ['viewed_at', 'viewedAt']] },
    { table: 'saved_idps', rows: () => SavedIDP.saved, Cls: SavedIDP, key: 'customer_id, idp_id',
      cols: [['customer_id', 'customerId', 'INTEGER'], ['idp_id', 'idpId', 'INTEGER'], ['saved_date', 'savedDate']] },
];

const url = process.env.DATABASE_URL;
const pool = url ? new pg.Pool({
    connectionString: url,
    ssl: /localhost|127\.0\.0\.1/.test(url) ? false : { rejectUnauthorized: false },
    max: 3,
}) : null;

export const enabled = pool != null;

// Creates the tables if they do not exist yet. Dates are kept as ISO text, exactly as the entities store them.
async function createTables(client) {
    for (const t of TABLES) {
        const cols = t.cols.map(([c, , type]) => `${c} ${type ?? 'TEXT'}`).join(', ');
        await client.query(`CREATE TABLE IF NOT EXISTS ${t.table} (${cols}, PRIMARY KEY (${t.key}))`);
    }
}

// Loads every table into the entity arrays. Returns false when the database is still empty.
export async function loadAll() {
    const client = await pool.connect();
    try {
        await createTables(client);
        const { rows } = await client.query('SELECT COUNT(*)::int AS n FROM user_accounts');
        if (rows[0].n === 0) return false;
        for (const t of TABLES) {
            const result = await client.query(`SELECT * FROM ${t.table} ORDER BY ${t.key}`);
            const target = t.rows();
            target.length = 0;
            for (const row of result.rows) {
                const obj = t.Cls === Object ? {} : new t.Cls();
                for (const [col, attr] of t.cols) obj[attr] = row[col];
                target.push(obj);
            }
        }
        return true;
    } finally {
        client.release();
    }
}

// Writes every entity array back to its table, in one transaction (the data set is small).
export async function saveAll() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        for (const t of [...TABLES].reverse()) await client.query(`DELETE FROM ${t.table}`);
        for (const t of TABLES) {
            const items = t.rows();
            if (!items.length) continue;
            const names = t.cols.map(([c]) => c).join(', ');
            const values = [], groups = [];
            items.forEach((item, i) => {
                groups.push(`(${t.cols.map((_, j) => `$${i * t.cols.length + j + 1}`).join(', ')})`);
                for (const [, attr] of t.cols) values.push(item[attr] ?? null);
            });
            await client.query(`INSERT INTO ${t.table} (${names}) VALUES ${groups.join(', ')}`, values);
        }
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK').catch(() => {});
        throw err;
    } finally {
        client.release();
    }
}

// Saves are queued one after another so two quick changes never overlap
let queue = Promise.resolve();
export function saveSoon() {
    if (!enabled) return;
    queue = queue.then(saveAll).catch(err => console.error('Database save failed:', err.message));
}
