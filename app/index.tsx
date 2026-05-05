import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';

export default function Index() {
  const { isAuthenticated, onboardingDone, tasteDone } = useAuthStore();

  if (!isAuthenticated || !onboardingDone) return <Redirect href="/(auth)/onboarding" />;
  if (!tasteDone) return <Redirect href="/(auth)/taste" />;
  return <Redirect href="/(tabs)" />;
}
