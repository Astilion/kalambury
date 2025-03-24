import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import CategoryItem from '../../components/CategoryItem';
import MenuButton from '../../components/MenuButton';
import { useGameStore } from '../../stores/gameStore';

export default function CategoriesScreen() {
  const router = useRouter();
  const {
    selectedCategories,
    availableCategories,
    toggleCategory,
    loadCategories,
    isLoading,
  } = useGameStore();

  // Load categories when component mounts
  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Categories</Text>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='#0000ff' />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      ) : (
        <FlatList
          data={availableCategories}
          renderItem={({ item }) => (
            <CategoryItem
              category={item}
              selected={selectedCategories[item.id] || false}
              onToggle={() => toggleCategory(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
          style={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No categories found. Add some categories first!
            </Text>
          }
        />
      )}

      <View style={styles.buttonContainer}>
        <MenuButton
          title='Save Categories'
          onPress={() => router.back()}
          iconName='content-save'
        />
      </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 10,
    gap: 10,
  },
});
