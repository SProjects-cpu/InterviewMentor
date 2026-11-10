import { drizzle } from 'drizzle-orm/node-postgres';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import pg from 'pg';
import Database from 'better-sqlite3';
import * as schema from '@shared/schema';
import * as schemaSqlite from './schema-sqlite';

const { Pool } = pg;

// Force SQLite for local development (no PostgreSQL dependency)
const isDevelopment = process.env.NODE_ENV !== 'production';
const forceLocalSQLite = true; // Force SQLite for local development
const hasPostgresUrl = !!process.env.DATABASE_URL && !forceLocalSQLite;

let db: any;

if (isDevelopment || forceLocalSQLite) {
  // Use SQLite for local development
  console.log('Using SQLite for local development');
  const sqlite = new Database('dev.db');

  // Initialize tables if they don't exist
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS resumes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      title TEXT NOT NULL,
      template TEXT NOT NULL DEFAULT 'stockholm',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      content TEXT NOT NULL,
      ats_score INTEGER
    );
  `);

  db = drizzleSqlite(sqlite, { schema: schemaSqlite });
} else {
  // Use PostgreSQL for production or when DATABASE_URL is provided
  console.log('Using PostgreSQL');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  db = drizzle(pool, { schema });
}

export { db };