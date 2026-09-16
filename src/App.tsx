import { useEffect, useState } from 'react';
import { useEvolve } from '@/state/store';
import Onboarding from '@/components/onboarding/Onboarding';
import WorldHome from '@/components/world/WorldHome';
import LogScreen from '@/components/log/LogScreen';
import MeScreen from '@/components/me/MeScreen';
import TabBar from '@/components/shell/TabBar';
import { announce } from '@/lib/announce';

export type Tab = 'world' | 'log' | 'me';

/** Minimal MVP navigation (blueprint §20): World | Log | Me. */
export default function App() {
  const onboardingComplete = useEvolve((s) => s.onboarding.completed);
  const [tab, setTab] = useState<Tab>('world');

  // Keep the screen-reader announcer fed with route changes (§22).
  useEffect(() => {
    const names: Record<Tab, string> = {
      world: 'Your world',
      log: 'Log an action',
      me: 'You and your history',
    };
    announce(names[tab]);
  }, [tab]);

  if (!onboardingComplete) {
    return <Onboarding />;
  }

  return (
    <>
      <main id="main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {tab === 'world' && <WorldHome onNavigate={setTab} />}
        {tab === 'log' && <LogScreen />}
        {tab === 'me' && <MeScreen />}
      </main>
      <TabBar active={tab} onChange={setTab} />
    </>
  );
}
