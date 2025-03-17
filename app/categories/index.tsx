import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { useRouter } from 'expo-router';
import CategoryItem from '../../components/CategoryItem';
import MenuButton from '../../components/MenuButton';
import { CATEGORIES } from '../../constants/Categories';
import { Category } from '../../types';
import { useGameStore } from '../../stores/gameStore';

export default function CategoriesScreen() {
  const router = useRouter();
  const [categories] = useState<Category[]>(CATEGORIES);
  const { selectedCategories, toggleCategory } = useGameStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Categories</Text>
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <CategoryItem
            category={item}
            selected={selectedCategories[item.id]}
            onToggle={() => toggleCategory(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      <MenuButton
        title='Save Categories'
        onPress={() => router.back()}
        iconName='content-save'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
});
