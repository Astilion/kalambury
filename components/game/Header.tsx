import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Player } from '@/types';
import { Colors } from '@/constants/Colors';

interface HeaderProps {
  title: string;
  currentPlayer: Player | null;
}
export default function Header({ title, currentPlayer }: HeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {currentPlayer && (
        <Text style={styles.currentPlayer}>
          Gracz: <Text style={styles.playerName}>{currentPlayer.name}</Text>
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginVertical: 20,
    marginTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
  },
  currentPlayer: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  playerName: {
    fontWeight: 'bold',
    color: Colors.success,
  },
});
