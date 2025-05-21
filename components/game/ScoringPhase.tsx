import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGameStore } from '@/stores/gameStore';
import Header from '@/components/game/Header';
import { Player } from '@/stores/gameStore';

interface ScoringPhaseProps {
  currentPlayer: Player | null;
  players: Player[];
  onPlayerScored: (playerId: string) => void;
  onNoOneScored: () => void;
}

export default function ScoringPhase({
  currentPlayer,
  players,
  onPlayerScored,
  onNoOneScored,
}: ScoringPhaseProps): React.ReactElement {
  const { currentWord } = useGameStore();

  return (
    <View style={styles.container}>
      <Header title='Kto odgadł hasło?' currentPlayer={currentPlayer} />

      <View style={styles.compactWordContainer}>
        {currentWord && (
          <Text style={styles.compactWord}>Hasło: "{currentWord}"</Text>
        )}
      </View>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreTitle}>Kto odgadł hasło?</Text>

        {players.length > 0 ? (
          <ScrollView style={styles.playerButtonsScrollView}>
            <View style={styles.playerButtons}>
              {players
                .filter((player) => player.id !== currentPlayer?.id)
                .map((player) => (
                  <TouchableOpacity
                    key={player.id}
                    style={styles.playerScoreButton}
                    onPress={() => onPlayerScored(player.id)}
                  >
                    <View style={styles.playerScoreContent}>
                      <Text
                        style={styles.playerScoreButtonText}
                        numberOfLines={1}
                        ellipsizeMode='tail'
                      >
                        {player.name}
                      </Text>
                      <Text style={styles.pointsText}>(+1)</Text>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          </ScrollView>
        ) : (
          <Text style={styles.noPlayers}>Brak graczy</Text>
        )}

        <TouchableOpacity
          style={[styles.button, styles.skipButton]}
          onPress={onNoOneScored}
        >
          <MaterialCommunityIcons name='skip-next' size={24} color='white' />
          <Text style={styles.buttonText}>Nikt nie odgadł</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  compactWordContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    marginHorizontal: 20,
  },
  compactWord: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  scoreContainer: {
    flex: 0.6,
  },
  scoreTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  playerButtonsScrollView: {
    maxHeight: 600,
  },
  playerButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 15,
  },
  playerScoreButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginHorizontal: 5,
    width: '46%',
  },
  playerScoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  playerScoreButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    marginRight: 5,
  },
  pointsText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'right',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    gap: 10,
  },
  skipButton: {
    backgroundColor: '#9E9E9E',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noPlayers: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
  },
});
