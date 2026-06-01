import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
      <Stack 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' } 
        }} 
        initialRouteName="login"
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="cadastro" />
      </Stack>
  );
}