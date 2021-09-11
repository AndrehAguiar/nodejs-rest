import { Pool } from 'pg';

const connectionString = 'postgres://xwurdquy:DDPQmPnn2KCT9M353JhQeM7ufal1v1ZE@kesavan.db.elephantsql.com/xwurdquy';

const db = new Pool({ connectionString });

export default db;