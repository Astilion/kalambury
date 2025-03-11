import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CategoryItemProps } from '../types';

const CategoryItem: React.FC<CategoryItemProps> = ({ category, selected, onToggle }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed ? styles.pressed : null,
        selected ? styles.selected : styles.unselected
      ]}
      onPress={onToggle}
    >
      <Text style={[styles.name, selected ? styles.selectedText : styles.unselectedText]}>
        {category.name}
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
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  pressed: {
    opacity: 0.8,
  },
  selected: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  unselected: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
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
  },
});

export default CategoryItem;