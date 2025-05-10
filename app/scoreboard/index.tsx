import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '@/stores/gameStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ButtonComponent from '@/components/ButtonComponent';

export default function ScoreboardScreen() {
  const router = useRouter();
  const { players } = useGameStore();

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tabela wyników</Text>
      </View>

      <FlatList
        data={sortedPlayers}
        renderItem={({ item, index }) => (
          <View style={styles.playerItem}>
            <View style={styles.rankContainer}>
              <Text style={styles.rankText}>{index + 1}</Text>
            </View>
            <Text style={styles.playerName}>{item.name}</Text>
            <Text style={styles.playerScore}>{item.score}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        style={styles.playerList}
        ListEmptyComponent={<Text style={styles.emptyList}>Brak graczy</Text>}
      />

      <View style={styles.bottomActions}>
        <ButtonComponent
          title='Powrót'
          variant='info'
          iconName='arrow-left'
          onPress={() => router.back()}
        />
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
  playerList: {
    flex: 1,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginBottom: 10,
  },
  rankContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f4511e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rankText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  playerName: {
    flex: 1,
    fontSize: 18,
  },
  playerScore: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  emptyList: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 30,
  },
  bottomActions: {
    marginTop: 20,
    marginBottom: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    gap: 10,
  },
  backButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
