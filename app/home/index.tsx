import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import MenuButton from '../../components/MenuButton';
import { AppRoute } from '@/types';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kalambury</Text>

      <View style={styles.menuContainer}>
        <MenuButton
          title='Nowa Gra'
          onPress={() => router.push('/new-game')}
          iconName='gamepad-variant'
        />
        <MenuButton
          title='Wybór Kategorii'
          onPress={() => router.push('/categories')}
          iconName='format-list-bulleted'
        />
        <MenuButton
          title='Wybór Graczy'
          onPress={() => router.push('/players' as any)}
          iconName='account-group'
        />
        <MenuButton
          title='Ustawienia'
          onPress={() => router.push('/settings')}
          iconName='cog'
        />
        <MenuButton
          title='Reklamy On/Off'
          onPress={() => router.push('/ads' as any)} // Type assertion as temporary solution
          iconName='youtube-tv'
        />
      </View>
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
  subtitle: {
    fontSize: 20,
    color: '#666',
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
