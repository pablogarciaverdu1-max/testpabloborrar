import { Redirect } from 'expo-router';

import { useApp } from '@/store/useApp';

export default function Index() {
  const loggedIn = useApp((s) => s.loggedIn);
  const onboarded = useApp((s) => s.onboarded);
  if (!loggedIn) return <Redirect href="/welcome" />;
  if (!onboarded) return <Redirect href="/onboarding" />;
  return <Redirect href="/discover" />;
}
