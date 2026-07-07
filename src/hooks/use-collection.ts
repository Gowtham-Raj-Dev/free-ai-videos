"use client";

import { useCallback, useEffect, useState } from "react";

/** localStorage-backed string list with cross-tab + same-tab sync. */
export function useCollection(key: string, max = 100) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setIds(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setIds(JSON.parse(e.newValue));
        } catch {
          /* ignore */
        }
      }
    };
    const onCustom = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string; newValue: string }>;
      if (customEvent.detail.key === key) {
        try {
          setIds(JSON.parse(customEvent.detail.newValue));
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("collection-update", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("collection-update", onCustom);
    };
  }, [key]);

  const save = useCallback(
    (next: string[]) => {
      setIds(next);
      try {
        const val = JSON.stringify(next);
        localStorage.setItem(key, val);
        window.dispatchEvent(
          new CustomEvent("collection-update", {
            detail: { key, newValue: val },
          })
        );
      } catch {
        /* ignore */
      }
    },
    [key],
  );

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback(
    (id: string) => {
      save(ids.includes(id) ? ids.filter((x) => x !== id) : [id, ...ids].slice(0, max));
    },
    [ids, save, max],
  );

  const push = useCallback(
    (id: string) => {
      save([id, ...ids.filter((x) => x !== id)].slice(0, max));
    },
    [ids, save, max],
  );

  const pushMany = useCallback(
    (newIds: string[]) => {
      const filtered = ids.filter((x) => !newIds.includes(x));
      save([...newIds, ...filtered].slice(0, max));
    },
    [ids, save, max],
  );

  const remove = useCallback(
    (id: string) => save(ids.filter((x) => x !== id)),
    [ids, save],
  );

  const clear = useCallback(() => save([]), [save]);

  return { ids, ready, has, toggle, push, pushMany, remove, clear };
}

export const useFavorites = () => useCollection("aiv-favorites", 200);
export const useRecent = () => useCollection("aiv-recent", 40);
export const useHistory = () => useCollection("aiv-downloads", 100);
export const usePdfDownloads = () => useCollection("aiv-pdf-downloads", 50);
