// Fisher-Yates shuffle - returns a new array, input is not mutated
export const shuffle = <T>(items: readonly T[]): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const pickRandom = <T>(items: readonly T[]): T | undefined =>
  items.length > 0
    ? items[Math.floor(Math.random() * items.length)]
    : undefined;
