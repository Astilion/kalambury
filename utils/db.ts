import * as SQLite from 'expo-sqlite';
import defaultData from '@/assets/data/defaultData.json';
import { Category, Phrase } from '@/types';

// Bump this whenever assets/data/defaultData.json changes,
// so existing installations re-seed their phrases on next launch
export const DATA_VERSION = 1;

const db = SQLite.openDatabaseSync('kalambury.db');

let initPromise: Promise<void> | null = null;

const createTables = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS phrases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      category TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL
    );
  `);
};

// Seeds phrases when the stored data version (PRAGMA user_version) is outdated.
// A fresh install and installs from before versioning both report version 0.
const seedDefaultData = async () => {
  const row = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version;',
  );
  if ((row?.user_version ?? 0) >= DATA_VERSION) {
    return;
  }

  // One transaction: either all phrases are replaced or nothing changes
  await db.withTransactionAsync(async () => {
    await db.execAsync('DELETE FROM phrases; DELETE FROM categories;');

    for (const [category, phrases] of Object.entries(defaultData)) {
      await db.runAsync(
        'INSERT INTO categories (id, name) VALUES (?, ?);',
        category,
        category,
      );
      for (const phrase of phrases) {
        await db.runAsync(
          'INSERT INTO phrases (text, category) VALUES (?, ?);',
          phrase,
          category,
        );
      }
    }

    // PRAGMA does not accept bound parameters; DATA_VERSION is a numeric constant
    await db.execAsync(`PRAGMA user_version = ${DATA_VERSION};`);
  });
};

// Safe to call many times - every caller awaits the same initialization
export const initDatabase = () => {
  if (!initPromise) {
    initPromise = (async () => {
      await createTables();
      await seedDefaultData();
    })().catch((error) => {
      console.error('❌ Error initializing database:', error);
      initPromise = null; // allow a retry on the next call
    });
  }
  return initPromise;
};

export const getPhrasesByCategory = async (
  categoryId: string,
): Promise<Phrase[]> => {
  try {
    await initDatabase();
    return await db.getAllAsync<Phrase>(
      'SELECT * FROM phrases WHERE category = ?;',
      categoryId,
    );
  } catch (error) {
    console.error(
      `❌ Error fetching phrases for category ${categoryId}:`,
      error,
    );
    return [];
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    await initDatabase();
    return await db.getAllAsync<Category>('SELECT * FROM categories;');
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return [];
  }
};
