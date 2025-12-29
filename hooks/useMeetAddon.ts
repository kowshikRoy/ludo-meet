'use client';
import { useEffect, useState } from 'react';
import { meet } from '@googleworkspace/meet-addons/meet.addons';

export function useMeetSidePanel() {
  const [client, setClient] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const session = await meet.addon.createAddonSession({
          cloudProjectNumber: '267833624800', // This needs to be replaced by user later
        });
        const sidePanelClient = await session.createSidePanelClient();
        setClient(sidePanelClient);
      } catch (err: any) {
        console.error('Failed to initialize Meet Side Panel:', err);
        setError(err.message || 'Unknown initialization error');
      }
    }

    // Only run if window.meet is available or we are in an iframe
    if (typeof window !== 'undefined' &&
      (window.location.search.includes('meet_sdk') || window.name.includes('meet_sdk'))) { // Simple check to avoid error in local dev
      init();
    }
    // Alternatively, we could fail silently or set a mock client for dev
  }, []);

  return { client, error };
}

export function useMeetMainStage() {
  const [client, setClient] = useState<any | null>(null);
  useEffect(() => {
    async function init() {
      try {
        const session = await meet.addon.createAddonSession({
          cloudProjectNumber: '267833624800',
        });
        const mainStageClient = await session.createMainStageClient();
        setClient(mainStageClient);
      } catch (error) {
        console.error('Failed to initialize Meet Main Stage:', error);
      }
    }
    if (typeof window !== 'undefined' &&
      (window.location.search.includes('meet_sdk') || window.name.includes('meet_sdk'))) {
      init();
    }
  }, []);

  return client;
}
