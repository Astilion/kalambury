import {
  Svg,
  Path,
  Text as SvgText,
  TextPath,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { View, Dimensions, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';

const { width: screenWidth } = Dimensions.get('window');

export default function CurvedTitle() {
  const svgWidth = screenWidth;
  const svgHeight = 160;
  const fontSize = screenWidth * 0.12;
  const startOffset = screenWidth < 400 ? '18%' : '19%';

  // Animation for subtle pulsing effect
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const AnimatedSvg = Animated.createAnimatedComponent(Svg);

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: svgHeight,
      }}
    >
      <AnimatedSvg
        width={svgWidth}
        height={svgHeight}
        style={{
          transform: [{ scale: pulseAnim }],
        }}
      >
        <Defs>
          <Path
            id='textPath'
            d={`M ${svgWidth * 0.05} ${svgHeight * 0.5} Q ${svgWidth * 0.5} ${
              svgHeight * 0.1
            } ${svgWidth * 0.95} ${svgHeight * 0.5}`}
          />

          <LinearGradient id='textGradient' x1='0' y1='0' x2='1' y2='0'>
            <Stop offset='0' stopColor='#FF9800' />
            <Stop offset='0.5' stopColor='#F44336' />
            <Stop offset='1' stopColor='#FF9800' />
          </LinearGradient>

          <LinearGradient id='shadowGradient' x1='0' y1='0' x2='1' y2='0'>
            <Stop offset='0' stopColor='#333333' />
            <Stop offset='1' stopColor='#555555' />
          </LinearGradient>
        </Defs>

        {/* Text shadow */}
        <SvgText
          fill='url(#shadowGradient)'
          fontSize={fontSize}
          fontWeight='bold'
          letterSpacing={2}
          dx='2'
          dy='2'
        >
          <TextPath href='#textPath' startOffset={startOffset}>
            Kalambury
          </TextPath>
        </SvgText>

        {/* Main text with gradient */}
        <SvgText
          fill='url(#textGradient)'
          fontSize={fontSize}
          fontWeight='bold'
          letterSpacing={2}
        >
          <TextPath href='#textPath' startOffset={startOffset}>
            Kalambury
          </TextPath>
        </SvgText>
      </AnimatedSvg>
    </View>
  );
}
