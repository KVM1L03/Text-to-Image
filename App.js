import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Home from './src/Home';
import 'react-native-url-polyfill/auto'

export default function App() {
  return (
    <SafeAreaView>
      <Home/>
    </SafeAreaView>
  );
}
