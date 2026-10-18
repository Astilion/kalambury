import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { pickRandom, shuffle } from '@/utils/random';

describe('shuffle', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns a new array with the same elements', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);

    expect(result).not.toBe(input);
    expect([...result].sort()).toEqual(input);
  });

  it('does not mutate the input array', () => {
    const input = [1, 2, 3, 4, 5];
    shuffle(input);

    expect(input).toEqual([1, 2, 3, 4, 5]);
  });

  it('swaps elements according to Math.random (Fisher-Yates)', () => {
    // Always pick j = 0, so each step swaps result[i] with result[0]
    jest.spyOn(Math, 'random').mockReturnValue(0);

    expect(shuffle(['a', 'b', 'c'])).toEqual(['b', 'c', 'a']);
  });

  it('handles empty and single-element arrays', () => {
    expect(shuffle([])).toEqual([]);
    expect(shuffle(['only'])).toEqual(['only']);
  });
});

describe('pickRandom', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns undefined for an empty array', () => {
    expect(pickRandom([])).toBeUndefined();
  });

  it('picks the element at the index derived from Math.random', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.99);
    expect(pickRandom(['a', 'b', 'c'])).toBe('c');

    jest.spyOn(Math, 'random').mockReturnValue(0);
    expect(pickRandom(['a', 'b', 'c'])).toBe('a');
  });
});
