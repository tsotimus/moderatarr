import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3';



const sqlite = new Database('moderatarr.db');
export const db = drizzle({ client: sqlite });

