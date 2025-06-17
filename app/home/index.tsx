import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '@/stores/gameStore';
import CurvedTitle from '@/components/CurvedTitle';
import ButtonComponent from '../../components/ButtonComponent';
import AdBanner from '@/components/ads/AdBanner';

export default function HomeScreen() {
  const router = useRouter();
  const {
    loadCategories,
    areCategoriesSelected,
    players,
    adsEnabled,
    toggleAds,
  } = useGameStore();

  useEffect(() => {
    loadCategories();
  }, []);

  const isCategoriesSelected = areCategoriesSelected();
  const hasEnoughPlayers = players.length >= 2;
  const isNewGameDisabled = !isCategoriesSelected || !hasEnoughPlayers;

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
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
            title={`Reklamy ${adsEnabled ? 'ON' : 'OFF'}`}
            onPress={toggleAds}
            iconName='youtube-tv'
            variant={adsEnabled ? 'success' : 'secondary'}
            size='medium'
            animation={{ pulse: true, press: true }}
            customColors={
              adsEnabled
                ? {
                    background: '#4CAF50',
                    backgroundActive: '#45a049',
                    text: '#fff',
                  }
                : {
                    background: '#f5f5f5',
                    backgroundActive: '#e0e0e0',
                    text: '#666',
                  }
            }
            iconColor={adsEnabled ? '#fff' : '#666'}
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

      <AdBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
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
