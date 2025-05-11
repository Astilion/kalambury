import React, { useEffect, useRef } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  View,
  Animated,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

export interface ButtonProps {
  title: string;
  onPress: () => void;
  iconName?: IconName;
  disabled?: boolean;
  // Custom styling options
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  customColors?: {
    background?: string;
    backgroundActive?: string;
    text?: string;
    disabled?: string;
  };
  customStyles?: {
    container?: StyleProp<ViewStyle>;
    button?: StyleProp<ViewStyle>;
    text?: StyleProp<TextStyle>;
    icon?: StyleProp<ViewStyle>;
  };
  // Animation options
  animation?: {
    pulse?: boolean;
    press?: boolean;
    duration?: number;
  };
  // Icon options
  iconPosition?: 'left' | 'right';
  iconSize?: number;
  iconColor?: string;
}

const ButtonComponent: React.FC<ButtonProps> = ({
  title,
  onPress,
  iconName,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  customColors = {},
  customStyles = {},
  animation = { pulse: true, press: true, duration: 2000 },
  iconPosition = 'left',
  iconSize,
  iconColor,
}) => {
  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bgColorAnim = useRef(new Animated.Value(0)).current;

  // Get colors based on variant
  const getVariantColors = () => {
    const variants = {
      primary: {
        background: '#f4511e',
        backgroundActive: '#ff7e47',
        text: 'white',
      },
      secondary: {
        background: '#6c757d',
        backgroundActive: '#7f8890',
        text: 'white',
      },
      success: {
        background: '#28a745',
        backgroundActive: '#2fc751',
        text: 'white',
      },
      danger: {
        background: '#dc3545',
        backgroundActive: '#e84c59',
        text: 'white',
      },
      warning: {
        background: '#f3bc16',
        backgroundActive: '#ffcd39',
        text: 'white',
      },
      info: {
        background: '#17a2b8',
        backgroundActive: '#1ab6cf',
        text: 'white',
      },
      light: {
        background: '#f8f9fa',
        backgroundActive: '#ffffff',
        text: 'black',
      },
      dark: {
        background: '#343a40',
        backgroundActive: '#454d55',
        text: 'white',
      },
    };

    return variants[variant];
  };

  const colors = {
    background: customColors.background || getVariantColors().background,
    backgroundActive:
      customColors.backgroundActive || getVariantColors().backgroundActive,
    text: customColors.text || getVariantColors().text,
    disabled: customColors.disabled || '#a0a0a0',
  };

  // Get size-based styles
  const getSizeStyles = () => {
    const sizes = {
      small: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        fontSize: 14,
        iconSize: 20,
      },
      medium: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        fontSize: 18,
        iconSize: 26,
      },
      large: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 16,
        fontSize: 20,
        iconSize: 30,
      },
    };

    return sizes[size];
  };

  const sizeStyles = getSizeStyles();

  // Pulse animation
  useEffect(() => {
    if (!disabled && animation.pulse) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(bgColorAnim, {
            toValue: 1,
            duration: animation.duration || 2000,
            useNativeDriver: false,
          }),
          Animated.timing(bgColorAnim, {
            toValue: 0,
            duration: animation.duration || 2000,
            useNativeDriver: false,
          }),
        ]),
      );

      pulseAnimation.start();

      return () => {
        pulseAnimation.stop();
      };
    }
  }, [disabled, animation.pulse]);

  const handlePressIn = () => {
    if (animation.press) {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        friction: 5,
        tension: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (animation.press) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  // Dynamic background color based on animation and disabled state
  const backgroundColor = disabled
    ? colors.disabled
    : bgColorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.background, colors.backgroundActive],
      });

  // Icon component
  const IconComponent = () =>
    iconName ? (
      <View style={[styles.iconContainer, customStyles.icon]}>
        <MaterialCommunityIcons
          name={iconName}
          size={iconSize || sizeStyles.iconSize}
          color={iconColor || colors.text}
        />
      </View>
    ) : null;

  return (
    <Animated.View
      style={[
        styles.buttonContainer,
        {
          maxWidth: fullWidth ? '100%' : 300,
          transform: [{ scale: scaleAnim }],
        },
        customStyles.container,
      ]}
    >
      <Pressable
        style={styles.pressableArea}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: false }}
      >
        <Animated.View
          style={[
            styles.button,
            {
              backgroundColor,
              paddingVertical: sizeStyles.paddingVertical,
              paddingHorizontal: sizeStyles.paddingHorizontal,
              borderRadius: sizeStyles.borderRadius,
            },
            customStyles.button,
          ]}
        >
          {iconPosition === 'left' && <IconComponent />}

          <Text
            style={[
              styles.text,
              {
                color: colors.text,
                fontSize: sizeStyles.fontSize,
              },
              customStyles.text,
            ]}
          >
            {title}
          </Text>

          {iconPosition === 'right' && <IconComponent />}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    marginVertical: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    alignSelf: 'center',
  },
  pressableArea: {
    overflow: 'hidden',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // Inner shadow effect
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  iconContainer: {
    marginRight: 12,
  },
});

export default ButtonComponent;
