import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import defaultData from '@/assets/data/defaultData.json';

type VersionRow = { user_version: number } | null;

const mockDb = {
  execAsync: jest.fn<(sql: string) => Promise<void>>(),
  runAsync: jest.fn<(sql: string, ...params: string[]) => Promise<unknown>>(),
  getAllAsync:
    jest.fn<(sql: string, ...params: string[]) => Promise<unknown[]>>(),
  getFirstAsync: jest.fn<(sql: string) => Promise<VersionRow>>(),
  withTransactionAsync: jest.fn<(task: () => Promise<void>) => Promise<void>>(),
};

jest.mock('expo-sqlite', () => ({
  openDatabaseSync: () => mockDb,
}));

const categoryCount = Object.keys(defaultData).length;
const phraseCount = Object.values(defaultData).flat().length;

let db: typeof import('@/utils/db');

const execCalls = (fragment: string) =>
  mockDb.execAsync.mock.calls.filter(([sql]) => sql.includes(fragment));

beforeEach(() => {
  jest.restoreAllMocks();
  mockDb.execAsync.mockReset().mockResolvedValue(undefined);
  mockDb.runAsync.mockReset().mockResolvedValue({});
  mockDb.getAllAsync.mockReset().mockResolvedValue([]);
  mockDb.getFirstAsync.mockReset().mockResolvedValue({ user_version: 0 });
  mockDb.withTransactionAsync
    .mockReset()
    .mockImplementation(async (task) => task());

  // Fresh module per test, so the memoized init promise starts empty
  jest.resetModules();
  db = jest.requireActual<typeof import('@/utils/db')>('@/utils/db');
});

describe('initDatabase', () => {
  it('seeds all default phrases when the data version is outdated', async () => {
    await db.initDatabase();

    expect(mockDb.withTransactionAsync).toHaveBeenCalledTimes(1);
    expect(execCalls('DELETE FROM phrases')).toHaveLength(1);
    expect(mockDb.runAsync).toHaveBeenCalledTimes(categoryCount + phraseCount);
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      'INSERT INTO categories (id, name) VALUES (?, ?);',
      'Filmy',
      'Filmy',
    );
    expect(execCalls(`PRAGMA user_version = ${db.DATA_VERSION}`)).toHaveLength(
      1,
    );
  });

  it('does not touch the data when it is already up to date', async () => {
    mockDb.getFirstAsync.mockResolvedValue({ user_version: db.DATA_VERSION });

    await db.initDatabase();

    expect(mockDb.withTransactionAsync).not.toHaveBeenCalled();
    expect(mockDb.runAsync).not.toHaveBeenCalled();
  });

  it('initializes only once when called concurrently', async () => {
    await Promise.all([
      db.initDatabase(),
      db.getCategories(),
      db.getPhrasesByCategory('Filmy'),
    ]);

    expect(execCalls('CREATE TABLE IF NOT EXISTS phrases')).toHaveLength(1);
    expect(mockDb.getFirstAsync).toHaveBeenCalledTimes(1);
  });

  it('retries on the next call after a failed initialization', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockDb.getFirstAsync.mockRejectedValueOnce(new Error('disk I/O error'));

    await db.initDatabase();
    await db.initDatabase();

    expect(mockDb.getFirstAsync).toHaveBeenCalledTimes(2);
    expect(mockDb.withTransactionAsync).toHaveBeenCalledTimes(1);
  });
});

describe('queries', () => {
  it('waits for initialization before reading categories', async () => {
    const categories = [{ id: 'Filmy', name: 'Filmy' }];
    mockDb.getAllAsync.mockResolvedValue(categories);

    const result = await db.getCategories();

    expect(result).toEqual(categories);
    const [seedOrder] = mockDb.withTransactionAsync.mock.invocationCallOrder;
    const [queryOrder] = mockDb.getAllAsync.mock.invocationCallOrder;
    expect(seedOrder).toBeLessThan(queryOrder);
  });

  it('queries phrases with a bound category parameter', async () => {
    await db.getPhrasesByCategory('Sport');

    expect(mockDb.getAllAsync).toHaveBeenCalledWith(
      'SELECT * FROM phrases WHERE category = ?;',
      'Sport',
    );
  });

  it('returns an empty list when the query fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockDb.getAllAsync.mockRejectedValue(new Error('no such table'));

    await expect(db.getPhrasesByCategory('Sport')).resolves.toEqual([]);
  });
});
