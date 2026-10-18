import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
export default function LoadingIndicator() {
  return (
    <View style={styles.container}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={Colors.primary} />
        <Text style={styles.loadingText}>Wczytywanie hasła...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.textSecondary,
  },
});
