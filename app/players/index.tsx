import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore, Player } from '@/stores/gameStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function PlayersSelectionScreen() {
  const router = useRouter();
  const {
    players,
    addPlayer,
    removePlayer,
    areCategoriesSelected,
    resetScores,
  } = useGameStore();
  const [newPlayerName, setNewPlayerName] = useState('');

  const handleAddPlayer = () => {
    if (players.length >= 19) {
      Alert.alert('Limit graczy', 'Można dodać maksymalnie 19 graczy.');
      return;
    }

    if (newPlayerName.trim()) {
      addPlayer(newPlayerName.trim());
      setNewPlayerName('');
    }
  };

  const handleStartGame = () => {
    if (players.length < 2) {
      Alert.alert('Błąd', 'Dodaj co najmniej dwóch graczy');
      return;
    }

    if (!areCategoriesSelected()) {
      Alert.alert(
        'Uwaga',
        'Nie wybrano żadnej kategorii. Przejdź do ustawień, aby wybrać kategorie.',
      );
      return;
    }

    router.push('/new-game');
  };

  const renderPlayerItem = ({ item }: { item: Player }) => (
    <View style={styles.playerItem}>
      <Text style={styles.playerName}>{item.name}</Text>
      <TouchableOpacity onPress={() => removePlayer(item.id)}>
        <MaterialCommunityIcons name='delete' size={24} color='#F44336' />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wybierz Graczy</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder='Nazwa gracza'
          value={newPlayerName}
          onChangeText={setNewPlayerName}
          onSubmitEditing={handleAddPlayer}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddPlayer}>
          <MaterialCommunityIcons name='plus' size={24} color='white' />
        </TouchableOpacity>
      </View>

      <FlatList
        data={players}
        renderItem={renderPlayerItem}
        keyExtractor={(item) => item.id}
        style={styles.playerList}
        ListEmptyComponent={
          <Text style={styles.emptyList}>
            Brak graczy, dodaj swoją drużynę!
          </Text>
        }
      />

      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={[styles.button, styles.startButton]}
          onPress={handleStartGame}
        >
          <MaterialCommunityIcons name='play' size={24} color='white' />
          <Text style={styles.buttonText}>Rozpocznij grę</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={() => router.push('/home')}
        >
          <MaterialCommunityIcons name='close' size={24} color='white' />
          <Text style={styles.buttonText}>Wyjście</Text>
        </TouchableOpacity>
        {players.length > 0 && (
          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={() => {
              Alert.alert(
                'Reset wyników',
                'Czy na pewno chcesz zresetować wszystkie wyniki?',
                [
                  { text: 'Anuluj', style: 'cancel' },
                  { text: 'Reset', onPress: resetScores },
                ],
              );
            }}
          >
            <MaterialCommunityIcons name='refresh' size={24} color='white' />
            <Text style={styles.buttonText}>Resetuj wyniki</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
    marginVertical: 40,
    marginTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f4511e',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  playerList: {
    flex: 1,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginBottom: 10,
  },
  playerName: {
    fontSize: 18,
  },
  emptyList: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 30,
  },
  bottomActions: {
    flexDirection: 'column',
    gap: 15,
    marginVertical: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    gap: 10,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#FF9800',
    marginTop: 10,
  },
  backButton: {
    backgroundColor: '#F44336',
  },
});
