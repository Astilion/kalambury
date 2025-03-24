import * as SQLite from 'expo-sqlite';

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
    // Check if data already exists
    const categories = await getCategories();
    if (categories.length > 0) {
      console.log('✅ Database already initialized');
      return; // Skip initialization if data exists
    }

    // Default categories from your constants
    const defaultCategories = [
      { id: 'animals', name: 'Animals' },
      { id: 'jobs', name: 'Jobs & Professions' },
      { id: 'sports', name: 'Sports' },
      { id: 'movies', name: 'Movies & TV Shows' },
      { id: 'food', name: 'Food & Drinks' },
    ];

    // Default phrases
    const defaultPhrases = [
      // Animals
      { text: 'Dog', category: 'animals' },
      { text: 'Cat', category: 'animals' },
      { text: 'Elephant', category: 'animals' },
      { text: 'Giraffe', category: 'animals' },
      { text: 'Lion', category: 'animals' },
      { text: 'Tiger', category: 'animals' },
      { text: 'Zebra', category: 'animals' },
      { text: 'Monkey', category: 'animals' },
      { text: 'Penguin', category: 'animals' },
      { text: 'Bear', category: 'animals' },

      // Jobs
      { text: 'Doctor', category: 'jobs' },
      { text: 'Teacher', category: 'jobs' },
      { text: 'Firefighter', category: 'jobs' },
      { text: 'Police Officer', category: 'jobs' },
      { text: 'Chef', category: 'jobs' },
      { text: 'Pilot', category: 'jobs' },
      { text: 'Engineer', category: 'jobs' },
      { text: 'Artist', category: 'jobs' },
      { text: 'Musician', category: 'jobs' },
      { text: 'Lawyer', category: 'jobs' },

      // Sports
      { text: 'Football', category: 'sports' },
      { text: 'Basketball', category: 'sports' },
      { text: 'Tennis', category: 'sports' },
      { text: 'Swimming', category: 'sports' },
      { text: 'Volleyball', category: 'sports' },
      { text: 'Baseball', category: 'sports' },
      { text: 'Golf', category: 'sports' },
      { text: 'Hockey', category: 'sports' },
      { text: 'Skiing', category: 'sports' },
      { text: 'Rugby', category: 'sports' },

      // Movies & TV
      { text: 'Star Wars', category: 'movies' },
      { text: 'Game of Thrones', category: 'movies' },
      { text: 'The Simpsons', category: 'movies' },
      { text: 'Friends', category: 'movies' },
      { text: 'Harry Potter', category: 'movies' },
      { text: 'Marvel', category: 'movies' },
      { text: 'Batman', category: 'movies' },
      { text: 'Breaking Bad', category: 'movies' },
      { text: 'Stranger Things', category: 'movies' },
      { text: 'The Office', category: 'movies' },

      // Food
      { text: 'Pizza', category: 'food' },
      { text: 'Hamburger', category: 'food' },
      { text: 'Sushi', category: 'food' },
      { text: 'Pasta', category: 'food' },
      { text: 'Chocolate', category: 'food' },
      { text: 'Coffee', category: 'food' },
      { text: 'Ice Cream', category: 'food' },
      { text: 'Taco', category: 'food' },
      { text: 'Pancake', category: 'food' },
      { text: 'Sandwich', category: 'food' },
    ];

    // Insert default categories
    for (const category of defaultCategories) {
      await insertCategory(category.id, category.name);
    }

    // Insert default phrases
    for (const phrase of defaultPhrases) {
      await insertPhrase(phrase.text, phrase.category);
    }

    console.log('✅ Default data initialized');
  } catch (error) {
    console.error('❌ Error initializing default data:', error);
  }
};

export default db;
