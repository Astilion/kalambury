import * as SQLite from 'expo-sqlite';
import defaultData from '../assets/data/defaultData.json';

// Open database using the new API
const db = SQLite.openDatabaseSync('kalambury.db');

export type Phrase = {
  id: number;
  text: string;
  category: string;
};
export type Category = {
  id: string;
  name: string;
};

// Create tables (async version)
export const createTables = async () => {
  try {
    // Create phrases table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS phrases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        category TEXT NOT NULL
      );
    `);
    // Create categories table
    await db.execAsync(`
            CREATE TABLE IF NOT EXISTS categories (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL
            );
            `);
    console.log('✅ Tables created');
  } catch (error) {
    console.error('❌ Error creating table:', error);
  }
};

// Insert phrase (async version)
export const insertPhrase = async (text: string, category: string) => {
  try {
    await db.runAsync(
      `INSERT INTO phrases (text, category) VALUES (?, ?);`,
      text,
      category,
    );
    console.log('✅ Phrase inserted');
  } catch (error) {
    console.error('❌ Error inserting phrase:', error);
  }
};

// Insert category (async version)
export const insertCategory = async (id: string, name: string) => {
  try {
    await db.runAsync(
      `INSERT INTO categories (id, name) VALUES (?, ?);`,
      id,
      name,
    );
    console.log('✅ Category inserted');
  } catch (error) {
    console.error('❌ Error inserting category:', error);
  }
};

// Fetch phrases (async version)
export const getPhrases = async (): Promise<Phrase[]> => {
  try {
    const result = await db.getAllAsync(`SELECT * FROM phrases;`);
    return result as Phrase[];
  } catch (error) {
    console.error('❌ Error fetching phrases:', error);
    return [];
  }
};

// Fetch phrases by category
export const getPhrasesByCategory = async (
  categoryId: string,
): Promise<Phrase[]> => {
  try {
    const result = await db.getAllAsync(
      `SELECT * FROM phrases WHERE category = ?;`,
      categoryId,
    );
    return result as Phrase[];
  } catch (error) {
    console.error(
      `❌ Error fetching phrases for category ${categoryId}:`,
      error,
    );
    return [];
  }
};

// Fetch all categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const result = await db.getAllAsync(`SELECT * FROM categories;`);
    return result as Category[];
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return [];
  }
};

// Initialize database with default data
export const initializeDefaultData = async () => {
  try {
    const categories = await getCategories();
    
    // if (categories.length > 0) {
    //   console.log('✅ Clearing old data');
    //   await db.execAsync('DELETE FROM phrases;');
    //   await db.execAsync('DELETE FROM categories;');
    // }

    if (categories.length > 0) {
      console.log('✅ Database already initialized');
      return;
    }

    for (const [category, phrases] of Object.entries(defaultData)) {
      await insertCategory(category, category);
      for (const phrase of phrases) {
        await insertPhrase(phrase, category);
      }
    }

    console.log('✅ Default data initialized');
  } catch (error) {
    console.error('❌ Error initializing default data:', error);
  }
};

export default db;
