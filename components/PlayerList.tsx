import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Player } from '@/stores/gameStore';
import PlayerItem from './PlayerItem';

interface PlayersListProps {
  players: Player[];
  onRemovePlayer: (id: string) => void;
  maxPlayers: number;
  showScores?: boolean;
  onPlayerPress?: (player: Player) => void;
  selectedPlayers?: string[];
}

export default function PlayersList({
  players,
  onRemovePlayer,
  maxPlayers,
  showScores = false,
  onPlayerPress,
  selectedPlayers = [],
}: PlayersListProps) {
  const playersCountText = useMemo(
    () => `${players.length}/${maxPlayers} graczy`,
    [players.length, maxPlayers],
  );

  const renderPlayerItem = useCallback(
    ({ item }: { item: Player }) => (
      <PlayerItem
        player={item}
        onRemove={onRemovePlayer}
        showScore={showScores}
        isSelected={selectedPlayers.includes(item.id)}
        onPress={onPlayerPress}
      />
    ),
    [onRemovePlayer, showScores, selectedPlayers, onPlayerPress],
  );

  const keyExtractor = useCallback((item: Player) => item.id, []);

  const ListEmptyComponent = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name='account-group' size={64} color='#CCC' />
        <Text style={styles.emptyText}>
          No players added yet.{'\n'}Add your team to get started!
        </Text>
      </View>
    ),
    [],
  );

  const ListHeaderComponent = useMemo(
    () =>
      players.length > 0 ? (
        <View style={styles.listHeader}>
          <Text style={styles.playersCount}>{playersCountText}</Text>
        </View>
      ) : null,
    [playersCountText, players.length],
  );

  return (
    <FlatList
      data={players}
      renderItem={renderPlayerItem}
      keyExtractor={keyExtractor}
      style={styles.list}
      contentContainerStyle={
        players.length === 0 ? styles.emptyListContainer : styles.listContainer
      }
      ListEmptyComponent={ListEmptyComponent}
      ListHeaderComponent={ListHeaderComponent}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyContainer: {
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    lineHeight: 24,
  },
  listHeader: {
    marginBottom: 15,
    alignItems: 'center',
  },
  playersCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});
