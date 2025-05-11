import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import CategoryItem from '../../components/CategoryItem';
import MenuButton from '../../components/ButtonComponent';
import { useGameStore } from '../../stores/gameStore';

// Get device dimensions
const { width } = Dimensions.get('window');

const COLUMN_COUNT = 2;
const CONTAINER_PADDING = 20;
const ITEM_SPACING = 10;

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
    try {
      loadCategories();
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }, []);

  // Define what our Category type looks like
  interface CategoryType {
    id: string;
    name: string;
  }

  const renderItem = ({
    item,
    index,
  }: {
    item: CategoryType;
    index: number;
  }) => {
    // Check if item is undefined or doesn't have required properties
    if (!item || !item.id) {
      console.warn('Encountered invalid category item', item);
      return null;
    }

    return (
      <View
        style={[
          styles.categoryContainer,
          index % 2 === 0
            ? { marginRight: ITEM_SPACING / 2 }
            : { marginLeft: ITEM_SPACING / 2 },
        ]}
      >
        <CategoryItem
          category={item}
          selected={selectedCategories[item.id] || false}
          onToggle={() => toggleCategory(item.id)}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wybierz Kategorie</Text>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='#0000ff' />
          <Text style={styles.loadingText}>Ładowanie...</Text>
        </View>
      ) : (
        <FlatList
          data={availableCategories?.filter(Boolean) || []}
          renderItem={renderItem}
          keyExtractor={(item) => item?.id || Math.random().toString()}
          numColumns={COLUMN_COUNT}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnsWrapper}
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
          title='Zapisz'
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
    padding: CONTAINER_PADDING,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 60,
    color: '#f4511e',
  },
  listContent: {
    paddingVertical: ITEM_SPACING,
  },
  list: {
    flex: 1,
  },
  columnsWrapper: {
    justifyContent: 'space-between',
    marginBottom: ITEM_SPACING * 1.2,
  },
  categoryContainer: {
    width: (width - CONTAINER_PADDING * 2 - ITEM_SPACING) / COLUMN_COUNT,
    marginBottom: 4,
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
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
});
