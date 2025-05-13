import React from 'react';
import {
  Modal,
  TouchableOpacity,
  Text,
  ScrollView,
  View,
  StyleSheet,
} from 'react-native';
import ButtonComponent from '../ButtonComponent';

interface Player {
  id: string;
  name: string;
  score: number;
}
interface FinalScoreModalProps {
  visible: boolean;
  players: Player[];
  onClose: () => void;
  onReturnToMenu: () => void;
}

export default function FinalScoreModal({
  visible,
  players,
  onClose,
  onReturnToMenu,
}: FinalScoreModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType='fade'
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={styles.modalContent}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={styles.modalTitle}>Końcowe Wyniki</Text>

          <ScrollView style={styles.scoresList}>
            {players.map((player, index) => (
              <View key={player.id} style={styles.scoreRow}>
                <Text style={styles.position}>{index + 1}.</Text>
                <Text style={styles.playerScoreName}>{player.name}</Text>
                <Text style={styles.playerScorePoints}>{player.score} pkt</Text>
              </View>
            ))}
          </ScrollView>
          <ButtonComponent
            title='Powrót do menu'
            variant='success'
            onPress={onReturnToMenu}
            iconName='home'
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#f4511e',
    marginBottom: 20,
  },
  scoresList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  position: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 30,
    color: '#555',
  },
  playerScoreName: {
    fontSize: 18,
    flex: 1,
    color: '#333',
  },
  playerScorePoints: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    width: 60,
    textAlign: 'right',
  },
  returnButton: {
    backgroundColor: '#4CAF50',
  },
});
