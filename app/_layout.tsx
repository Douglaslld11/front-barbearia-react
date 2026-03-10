import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { COLORS } from '../constants/theme';
import { LanguageProvider } from '../stores/LanguageContext';
import { BarbeariaProvider } from '../stores/BarbeariaContext';

export default function RootLayout() {
  return (
    <BarbeariaProvider>
      <LanguageProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: COLORS.background },
              animation: 'fade_from_bottom',
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="landing" options={{ headerShown: false }} />
            <Stack.Screen name="admin" options={{ headerShown: false }} />
            <Stack.Screen name="[slug]" options={{ headerShown: false }} />
          </Stack>
        </GestureHandlerRootView>
      </LanguageProvider>
    </BarbeariaProvider>
  );
}
