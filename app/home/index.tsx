import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import MenuButton from '../../components/MenuButton';
import { useGameStore } from '@/stores/gameStore';
import { AppRoute } from '@/types';
import CurvedTitle from '@/components/CurvedTitle';
import ButtonComponent from '../../components/MenuButton';

export default function HomeScreen() {
  const router = useRouter();
  const { loadCategories, areCategoriesSelected, players } = useGameStore();

  useEffect(() => {
    loadCategories();
  }, []);

  const isCategoriesSelected = areCategoriesSelected();
  const hasEnoughPlayers = players.length >= 2;

  const isNewGameDisabled = !isCategoriesSelected || !hasEnoughPlayers;

  return (
    <View style={styles.container}>
      <CurvedTitle />
      <View style={styles.menuContainer}>
        <ButtonComponent
          title='Szybka Gra'
          onPress={() => router.push('/swiftplay')}
          iconName='lightning-bolt-outline'
          variant='primary'
          size='medium'
          animation={{ pulse: true, press: true }}
        />
        <ButtonComponent
          title='Nowa Gra'
          onPress={() => router.push('/new-game')}
          iconName='gamepad-variant'
          disabled={isNewGameDisabled}
          variant='primary'
          size='medium'
          animation={{ pulse: true, press: true }}
        />
        <ButtonComponent
          title='Wybór Kategorii'
          onPress={() => router.push('/categories')}
          iconName='format-list-bulleted'
          variant='primary'
          size='medium'
          animation={{ pulse: true, press: true }}
        />
        <ButtonComponent
          title='Wybór Graczy'
          onPress={() => router.push('/players' as any)}
          iconName='account-group'
          variant='primary'
          size='medium'
          animation={{ pulse: true, press: true }}
        />
        <ButtonComponent
          title='Ustawienia'
          onPress={() => router.push('/settings')}
          iconName='cog'
          variant='primary'
          size='medium'
          animation={{ pulse: true, press: true }}
        />
        <ButtonComponent
          title='Reklamy On/Off'
          onPress={() => router.push('/ads' as any)}
          iconName='youtube-tv'
          variant='primary'
          size='medium'
          animation={{ pulse: true, press: true }}
        />
      </View>
      {!isCategoriesSelected && (
        <Text style={styles.warning}>
          Wybierz przynajmniej jedną kategorię, aby rozpocząć grę
        </Text>
      )}
      {!hasEnoughPlayers && (
        <Text style={styles.warning}>
          Aby rozpocząć grę, dodaj przynajmniej dwóch graczy
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#f4511e',
    marginBottom: 40,
  },
  menuContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 15,
  },
  warning: {
    marginTop: 20,
    color: '#e53935',
    fontSize: 14,
    textAlign: 'center',
  },
});
