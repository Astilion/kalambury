// components/PlayerItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Player } from '@/stores/gameStore';

interface PlayerItemProps {
  player: Player;
  onRemove: (id: string) => void;
  showScore?: boolean;
  isSelected?: boolean;
  onPress?: (player: Player) => void;
}

export default function PlayerItem({
  player,
  onRemove,
  showScore = false,
  isSelected = false,
  onPress,
}: PlayerItemProps) {
  const handleRemove = () => {
    Alert.alert(
      'Usuń Gracza',
      `Czy Na pewno chcesz usunąć Gracza: ${player.name}?`,
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: () => onRemove(player.id),
        },
      ],
    );
  };

  const handlePress = () => {
    onPress?.(player);
  };

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={onPress ? handlePress : undefined}
      activeOpacity={onPress ? 0.7 : 1}
      accessibilityLabel={`Player ${player.name}${
        showScore ? `, score ${player.score}` : ''
      }`}
      accessibilityRole={onPress ? 'button' : 'text'}
    >
      <View style={styles.playerInfo}>
        <Text
          style={[styles.playerName, isSelected && styles.selectedText]}
          numberOfLines={1}
        >
          {player.name}
        </Text>
        {showScore && (
          <Text style={[styles.playerScore, isSelected && styles.selectedText]}>
            Score: {player.score || 0}
          </Text>
        )}
      </View>

      <TouchableOpacity
        onPress={handleRemove}
        style={styles.deleteButton}
        accessibilityLabel={`Remove player ${player.name}`}
        accessibilityRole='button'
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <MaterialCommunityIcons name='delete' size={24} color='#F44336' />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

PlayerItem.displayName = 'PlayerItem';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  selectedContainer: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  playerInfo: {
    flex: 1,
    marginRight: 10,
  },
  playerName: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  playerScore: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  selectedText: {
    color: '#1976D2',
  },
  deleteButton: {
    padding: 5,
  },
});
