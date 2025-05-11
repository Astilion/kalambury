import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CategoryItemProps {
  category: {
    id: string;
    name: string;
  };
  selected: boolean;
  onToggle: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  selected,
  onToggle,
}) => {
  // Safety check in case we receive an undefined category
  if (!category || typeof category !== 'object') {
    return null;
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed ? styles.pressed : null,
        selected ? styles.selected : styles.unselected,
      ]}
      onPress={onToggle}
      android_ripple={{ color: selected ? '#BBDEFB' : '#E0E0E0' }}
    >
      <Text
        style={[
          styles.name,
          selected ? styles.selectedText : styles.unselectedText,
        ]}
        numberOfLines={2}
        ellipsizeMode='tail'
      >
        {category.name || 'Unnamed Category'}
      </Text>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={selected ? 'check-circle' : 'circle-outline'}
          size={24}
          color={selected ? '#4CAF50' : '#757575'}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    minHeight: 70,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pressed: {
    opacity: 0.8,
  },
  selected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  unselected: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    paddingRight: 8,
    flexWrap: 'wrap', 
  },
  selectedText: {
    color: '#2196F3',
  },
  unselectedText: {
    color: '#757575',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4, 
    width: 28,
  },
});

export default CategoryItem;
