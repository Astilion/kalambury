import { useRouter } from 'expo-router';
import { View, Text } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();


  return (
    <View>
        <Text>Hello world</Text>
    </View>
  )
}
