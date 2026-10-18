import { useGameStore } from '@/stores/gameStore';
import { getPhrasesByCategory } from '@/utils/db';
import { Phrase } from '@/types';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('@/utils/db', () => ({
  getCategories: jest.fn(),
  getPhrasesByCategory: jest.fn(),
}));

const mockedGetPhrasesByCategory = jest.mocked(getPhrasesByCategory);

const categories = [
  { id: 'animals', name: 'Zwierzęta' },
  { id: 'movies', name: 'Filmy' },
  { id: 'sports', name: 'Sport' },
];

const phrase = (text: string): Phrase => ({ id: 1, text, category: 'animals' });

const players = [
  { id: 'p1', name: 'Ania', score: 0 },
  { id: 'p2', name: 'Bartek', score: 0 },
  { id: 'p3', name: 'Celina', score: 0 },
];

beforeEach(() => {
  useGameStore.setState(useGameStore.getInitialState(), true);
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe('players', () => {
  it('adds a player with zero score', () => {
    useGameStore.getState().addPlayer('Ania');

    const { players } = useGameStore.getState();
    expect(players).toHaveLength(1);
    expect(players[0]).toMatchObject({ name: 'Ania', score: 0 });
  });

  it('adds a point only to the given player', () => {
    useGameStore.setState({ players });

    useGameStore.getState().addPoint('p2');

    expect(useGameStore.getState().players.map((p) => p.score)).toEqual([
      0, 1, 0,
    ]);
  });

  it('resets all scores and the active player', () => {
    useGameStore.setState({
      players: players.map((p) => ({ ...p, score: 5 })),
      activePlayer: 2,
    });

    useGameStore.getState().resetScores();

    const state = useGameStore.getState();
    expect(state.players.every((p) => p.score === 0)).toBe(true);
    expect(state.activePlayer).toBe(0);
  });

  it('keeps the same active player when someone before them is removed', () => {
    useGameStore.setState({ players, activePlayer: 2 }); // Celina

    useGameStore.getState().removePlayer('p1');

    const state = useGameStore.getState();
    expect(state.players[state.activePlayer].id).toBe('p3');
  });

  it('keeps the active index when someone after them is removed', () => {
    useGameStore.setState({ players, activePlayer: 0 }); // Ania

    useGameStore.getState().removePlayer('p3');

    expect(useGameStore.getState().activePlayer).toBe(0);
  });

  it('wraps to the first player when the last active player is removed', () => {
    useGameStore.setState({ players, activePlayer: 2 });

    useGameStore.getState().removePlayer('p3');

    expect(useGameStore.getState().activePlayer).toBe(0);
  });

  it('gives the turn to the next player when the active one is removed', () => {
    useGameStore.setState({ players, activePlayer: 1 }); // Bartek

    useGameStore.getState().removePlayer('p2');

    const state = useGameStore.getState();
    expect(state.players[state.activePlayer].id).toBe('p3');
  });
});

describe('categories', () => {
  it('toggles a single category', () => {
    useGameStore.getState().toggleCategory('animals');
    expect(useGameStore.getState().selectedCategories.animals).toBe(true);

    useGameStore.getState().toggleCategory('animals');
    expect(useGameStore.getState().selectedCategories.animals).toBe(false);
  });

  it('selects and deselects all available categories', () => {
    useGameStore.setState({ availableCategories: categories });

    useGameStore.getState().toggleAllCategories(true);
    expect(useGameStore.getState().areCategoriesSelected()).toBe(true);

    useGameStore.getState().toggleAllCategories(false);
    expect(useGameStore.getState().areCategoriesSelected()).toBe(false);
  });

  it('offers two different categories, only from the selected ones', () => {
    useGameStore.setState({
      availableCategories: categories,
      selectedCategories: { animals: true, movies: true, sports: false },
    });

    useGameStore.getState().generateCategoryOptions();

    const ids = useGameStore.getState().categoryOptions.map((c) => c.id);
    expect(ids).toHaveLength(2);
    expect(new Set(ids)).toEqual(new Set(['animals', 'movies']));
  });

  it('offers the only selected category when just one is selected', () => {
    useGameStore.setState({
      availableCategories: categories,
      selectedCategories: { animals: false, movies: true, sports: false },
    });

    useGameStore.getState().generateCategoryOptions();

    expect(useGameStore.getState().categoryOptions).toEqual([
      { id: 'movies', name: 'Filmy' },
    ]);
  });
});

describe('words', () => {
  it('loads a word from the selected category', async () => {
    mockedGetPhrasesByCategory.mockResolvedValue([phrase('Słoń')]);

    const success = await useGameStore.getState().selectCategory('animals');

    const state = useGameStore.getState();
    expect(success).toBe(true);
    expect(state.currentWord).toBe('Słoń');
    expect(state.isLoading).toBe(false);
    expect(state.wordChangesRemaining).toBe(3);
    expect(mockedGetPhrasesByCategory).toHaveBeenCalledWith('animals');
  });

  it('retries once and reports failure when the category has no phrases', async () => {
    mockedGetPhrasesByCategory.mockResolvedValue([]);
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    const success = await useGameStore.getState().selectCategory('animals');

    expect(success).toBe(false);
    expect(mockedGetPhrasesByCategory).toHaveBeenCalledTimes(2);
    expect(useGameStore.getState().isLoading).toBe(false);
  });

  it('uses up a word change when changing the word', async () => {
    mockedGetPhrasesByCategory.mockResolvedValue([phrase('Żyrafa')]);
    useGameStore.setState({ selectedCategoryId: 'animals' });

    await useGameStore.getState().changeWord();

    const state = useGameStore.getState();
    expect(state.currentWord).toBe('Żyrafa');
    expect(state.wordChangesRemaining).toBe(2);
  });

  it('does not change the word when no changes are left', async () => {
    useGameStore.setState({
      selectedCategoryId: 'animals',
      currentWord: 'Kot',
      wordChangesRemaining: 0,
    });

    await useGameStore.getState().changeWord();

    expect(useGameStore.getState().currentWord).toBe('Kot');
    expect(mockedGetPhrasesByCategory).not.toHaveBeenCalled();
  });
});

describe('nextWord', () => {
  it('gives the turn to the player who guessed the word', async () => {
    useGameStore.setState({ players, activePlayer: 0 });

    await useGameStore.getState().nextWord('p3');

    expect(useGameStore.getState().activePlayer).toBe(2);
  });

  it('gives the turn to a different player when nobody guessed', async () => {
    useGameStore.setState({ players, activePlayer: 1 });

    for (const random of [0, 0.5, 0.99]) {
      jest.spyOn(Math, 'random').mockReturnValue(random);
      useGameStore.setState({ activePlayer: 1 });

      await useGameStore.getState().nextWord(null);

      expect(useGameStore.getState().activePlayer).not.toBe(1);
    }
  });

  it('resets word changes and clears the current word for the new round', async () => {
    useGameStore.setState({
      players,
      currentWord: 'Kot',
      wordChangesRemaining: 0,
    });

    await useGameStore.getState().nextWord(null);

    const state = useGameStore.getState();
    expect(state.currentWord).toBeNull();
    expect(state.wordChangesRemaining).toBe(3);
  });
});
