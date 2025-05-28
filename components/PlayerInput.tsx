import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Player } from '@/stores/gameStore';

interface PlayerInputProps {
  onAddPlayer: (name: string) => void;
  existingPlayers: Player[];
  maxPlayers: number;
  disabled?: boolean;
}

export default function PlayerInput({
  onAddPlayer,
  existingPlayers,
  maxPlayers,
  disabled = false,
}: PlayerInputProps) {
  const [playerName, setPlayerName] = useState('');

  const validatePlayerName = useCallback(
    (name: string): string | null => {
      const trimmedName = name.trim();

      if (!trimmedName) {
        return 'Player name cannot be empty';
      }

      if (trimmedName.length < 2) {
        return 'Player name must be at least 2 characters long';
      }

      if (trimmedName.length > 20) {
        return 'Player name must be less than 20 characters';
      }

      if (
        existingPlayers.some(
          (player) => player.name.toLowerCase() === trimmedName.toLowerCase(),
        )
      ) {
        return 'Player with this name already exists';
      }

      return null;
    },
    [existingPlayers],
  );

  const handleAddPlayer = useCallback(() => {
    if (existingPlayers.length >= maxPlayers) {
      Alert.alert('Player Limit', `Maximum ${maxPlayers} players allowed.`);
      return;
    }

    const validationError = validatePlayerName(playerName);
    if (validationError) {
      Alert.alert('Invalid Name', validationError);
      return;
    }

    onAddPlayer(playerName.trim());
    setPlayerName('');
  }, [
    playerName,
    existingPlayers.length,
    maxPlayers,
    validatePlayerName,
    onAddPlayer,
  ]);

  const isInputValid = !validatePlayerName(playerName) && playerName.trim();
  const isDisabled = disabled || !isInputValid;

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          !isInputValid && playerName.trim() ? styles.inputError : null,
          disabled && styles.inputDisabled,
        ]}
        placeholder='Enter player name'
        value={playerName}
        onChangeText={setPlayerName}
        onSubmitEditing={handleAddPlayer}
        maxLength={20}
        autoCapitalize='words'
        returnKeyType='done'
        accessibilityLabel='Player name input'
        editable={!disabled}
      />

      <TouchableOpacity
        style={[styles.addButton, isDisabled && styles.addButtonDisabled]}
        onPress={handleAddPlayer}
        disabled={isDisabled}
        accessibilityLabel='Add player'
        accessibilityRole='button'
      >
        <MaterialCommunityIcons
          name='plus'
          size={24}
          color={isDisabled ? '#CCC' : 'white'}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: '#FAFAFA',
  },
  inputError: {
    borderColor: '#F44336',
    borderWidth: 2,
  },
  inputDisabled: {
    backgroundColor: '#F0F0F0',
    color: '#999',
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addButtonDisabled: {
    backgroundColor: '#E0E0E0',
    elevation: 0,
    shadowOpacity: 0,
  },
});
