// components/game/Header.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Player } from '@/types';

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
    color: '#f4511e',
    marginBottom: 10,
  },
  currentPlayer: {
    fontSize: 18,
    color: '#666',
  },
  playerName: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});
