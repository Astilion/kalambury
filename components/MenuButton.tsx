import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MenuButtonProps } from '../types';

const MenuButton: React.FC<MenuButtonProps> = ({
  title,
  onPress,
  iconName = 'chevron-right',
  disabled = false,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed ? styles.buttonPressed : null,
        disabled ? styles.buttonDisabled : null,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {iconName && (
        <MaterialCommunityIcons
          name={iconName}
          size={24}
          color='white'
          style={styles.icon}
        />
      )}
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4511e',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    maxWidth: 300,
  },
  buttonPressed: {
    backgroundColor: '#d03a0c',
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  icon: {
    marginRight: 8,
  },
});

export default MenuButton;
