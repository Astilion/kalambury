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
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Screen size categories
const getScreenSize = () => {
  if (screenWidth < 360) return 'xs'; // Very small phones
  if (screenWidth < 414) return 'sm'; // Small phones (iPhone SE, etc.)
  if (screenWidth < 480) return 'md'; // Medium phones
  return 'lg'; // Large phones and tablets
};

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
  // Responsive options
  responsiveScale?: boolean; // Enable/disable responsive scaling
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
  responsiveScale = true,
}) => {
  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bgColorAnim = useRef(new Animated.Value(0)).current;

  // Get responsive scale factor
  const getScaleFactor = () => {
    if (!responsiveScale) return 1;

    const screenSize = getScreenSize();
    const scaleFactors = {
      xs: 0.75, // Very small phones - 75% size
      sm: 0.85, // Small phones - 85% size
      md: 0.95, // Medium phones - 95% size
      lg: 1.0, // Large phones - 100% size
    };
    return scaleFactors[screenSize];
  };

  const scaleFactor = getScaleFactor();

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

  // Get size-based styles with responsive scaling
  const getSizeStyles = () => {
    const baseSizes = {
      small: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        fontSize: 14,
        iconSize: 20,
        minHeight: 40,
      },
      medium: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        fontSize: 16,
        iconSize: 24,
        minHeight: 56,
      },
      large: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        fontSize: 18,
        iconSize: 28,
        minHeight: 62,
      },
    };

    const baseSize = baseSizes[size];

    // Apply responsive scaling
    return {
      paddingVertical: Math.round(baseSize.paddingVertical * scaleFactor),
      paddingHorizontal: Math.round(baseSize.paddingHorizontal * scaleFactor),
      borderRadius: Math.round(baseSize.borderRadius * scaleFactor),
      fontSize: Math.round(baseSize.fontSize * scaleFactor),
      iconSize: Math.round(baseSize.iconSize * scaleFactor),
      minHeight: Math.round(baseSize.minHeight * scaleFactor),
    };
  };

  const sizeStyles = getSizeStyles();

  // Calculate maximum width based on screen size
  const getMaxWidth = () => {
    if (fullWidth) return '100%';

    const screenSize = getScreenSize();
    const maxWidths = {
      xs: Math.min(screenWidth - 40, 280), // Very small screens
      sm: Math.min(screenWidth - 40, 320), // Small screens
      md: Math.min(screenWidth - 40, 360), // Medium screens
      lg: 400, // Large screens
    };

    return maxWidths[screenSize];
  };

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
          maxWidth: getMaxWidth(),
          transform: [{ scale: scaleAnim }],
          marginVertical: Math.max(4, 8 * scaleFactor), // Responsive margin
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
              minHeight: sizeStyles.minHeight,
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
            numberOfLines={1}
            adjustsFontSizeToFit
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
    width: '80%',
    elevation: 4, // Reduced elevation for smaller screens
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    alignSelf: 'center',
  },
  pressableArea: {
    overflow: 'hidden',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    flex: 1,
  },
  iconContainer: {
    marginHorizontal: 8, // Changed from marginRight to marginHorizontal
  },
});

export default ButtonComponent;
