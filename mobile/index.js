// Conditionally import gesture-handler (not needed for web)
import { Platform } from 'react-native';
if (Platform.OS !== 'web') {
  require('react-native-gesture-handler');
}

import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
