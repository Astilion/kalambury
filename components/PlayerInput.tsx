import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Player } from '@/types';
import { Colors } from '@/constants/Colors';

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
        return 'Imię gracza nie może być puste';
      }

      if (trimmedName.length < 2) {
        return 'Imię gracza musi mieć co najmniej 2 znaki';
      }

      if (trimmedName.length > 20) {
        return 'Imię gracza może mieć maksymalnie 20 znaków';
      }

      if (
        existingPlayers.some(
          (player) => player.name.toLowerCase() === trimmedName.toLowerCase(),
        )
      ) {
        return 'Gracz o tym imieniu już istnieje';
      }

      return null;
    },
    [existingPlayers],
  );

  const handleAddPlayer = useCallback(() => {
    if (existingPlayers.length >= maxPlayers) {
      Alert.alert('Limit graczy', `Maksymalna liczba graczy: ${maxPlayers}.`);
      return;
    }

    const validationError = validatePlayerName(playerName);
    if (validationError) {
      Alert.alert('Nieprawidłowe imię', validationError);
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
        placeholder='Wpisz imię gracza'
        value={playerName}
        onChangeText={setPlayerName}
        onSubmitEditing={handleAddPlayer}
        maxLength={20}
        autoCapitalize='words'
        returnKeyType='done'
        accessibilityLabel='Imię gracza'
        editable={!disabled}
      />

      <TouchableOpacity
        style={[styles.addButton, isDisabled && styles.addButtonDisabled]}
        onPress={handleAddPlayer}
        disabled={isDisabled}
        accessibilityLabel='Dodaj gracza'
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
    borderColor: Colors.danger,
    borderWidth: 2,
  },
  inputDisabled: {
    backgroundColor: '#F0F0F0',
    color: Colors.textMuted,
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addButtonDisabled: {
    backgroundColor: Colors.border,
    elevation: 0,
    shadowOpacity: 0,
  },
});
