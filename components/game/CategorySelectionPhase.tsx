import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useGameStore } from '@/stores/gameStore';
import ButtonComponent from '@/components/ButtonComponent';
import Header from './Header';
import { Player } from '@/types';

interface CategorySelectionPhaseProps {
  currentPlayer: Player | null;
  onCategorySelect: (categoryId: string) => Promise<void>;
  onEndGame: () => void;
  isLoading: boolean;
}

export default function CategorySelectionPhase({
  currentPlayer,
  onCategorySelect,
  onEndGame,
  isLoading,
}: CategorySelectionPhaseProps): React.ReactElement {
  const { categoryOptions } = useGameStore();

  return (
    <View style={styles.container}>
      <Header title='Wybierz Kategorię' currentPlayer={currentPlayer} />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='#f4511e' />
          <Text style={styles.loadingText}>Wczytywanie kategorii...</Text>
        </View>
      ) : (
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryPrompt}>Wybierz jedną z kategorii:</Text>
          {categoryOptions.map((category) => (
            <ButtonComponent
              title={category.name}
              key={category.id}
              variant='info'
              size='large'
              onPress={() => onCategorySelect(category.id)}
            />
          ))}

          {categoryOptions.length === 0 && (
            <Text style={styles.noCategories}>
              Brak dostępnych kategorii. Sprawdź ustawienia.
            </Text>
          )}
        </View>
      )}
      <ButtonComponent
        title='Zakończ Grę'
        onPress={onEndGame}
        variant='danger'
        iconName='close'
        animation={{ pulse: false, press: true }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoryContainer: {
    flex: 0.7,
    padding: 20,
    alignItems: 'center',
  },
  categoryPrompt: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  noCategories: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 30,
  },
  loadingContainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
