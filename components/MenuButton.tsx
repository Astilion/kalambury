import React, { useEffect, useRef } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  View,
  Animated,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MenuButtonProps } from '../types';

const MenuButton: React.FC<MenuButtonProps> = ({
  title,
  onPress,
  iconName = 'chevron-right',
  disabled = false,
}) => {
  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bgColorAnim = useRef(new Animated.Value(0)).current;

  // Subtle pulse animation for idle state
  useEffect(() => {
    if (!disabled) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(bgColorAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(bgColorAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: false,
          }),
        ]),
      );

      pulseAnimation.start();

      return () => {
        pulseAnimation.stop();
      };
    }
  }, [disabled]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 5,
      tension: 300,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 200,
      useNativeDriver: true,
    }).start();
  };

  // Dynamic background color based on animation and disabled state
  const backgroundColor = disabled
    ? '#a0a0a0'
    : bgColorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#f4511e', '#ff7e47'],
      });

  return (
    <Animated.View
      style={[styles.buttonContainer, { transform: [{ scale: scaleAnim }] }]}
    >
      <Pressable
        style={styles.pressableArea}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: false }}
      >
        <Animated.View style={[styles.button, { backgroundColor }]}>
          {iconName && (
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={iconName}
                size={26}
                color='white'
                style={styles.icon}
              />
            </View>
          )}
          <Text style={styles.text}>{title}</Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    marginVertical: 8,
    // Elevation shadow for Android
    elevation: 6,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    borderRadius: 12,
  },
  pressableArea: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    // Inner shadow effect
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  iconContainer: {
    marginRight: 12,
    // Add slight "glow" effect
    opacity: 1,
  },
  icon: {},
});

export default MenuButton;
