'use client';

import { useEffect } from 'react';

export function AuthHashRedirect() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const params = new URLSearchParams(hash.slice(1));
    const hasAuthResult = params.has('access_token') || params.has('error') || params.has('error_description');
    if (!hasAuthResult) return;

    const error = params.get('error_description') ?? params.get('error');
    const target = error
      ? `/login?mode=signin&error=${encodeURIComponent(error)}`
      : '/login?auth=confirmed&mode=signin';

    window.history.replaceState(null, '', target);
    window.location.replace(target);
  }, []);

  return null;
}
