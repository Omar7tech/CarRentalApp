import { router } from '@inertiajs/react';
import { useState, useCallback } from 'react';

type Filters = Record<string, any>;

interface FilterConfig {
  route: Parameters<typeof router.get>[0];
  only: string[];
  defaults?: Filters;
}

export function useTableFilters({ route, only, defaults = {} }: FilterConfig) {
  const [filters, setFilters] = useState<Filters>(defaults);
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const setFilterLoading = (key: string, value: boolean) =>
    setLoading((prev) => ({ ...prev, [key]: value }));

  const apply = useCallback(
    (nextFilters: Filters, loadingKey?: string) => {
      const cleaned = Object.fromEntries(
        Object.entries(nextFilters).filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
      );

      router.get(route, { filter: cleaned }, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
        only,
        showProgress: false,
        onStart: () => loadingKey && setFilterLoading(loadingKey, true),
        onFinish: () => loadingKey && setFilterLoading(loadingKey, false),
      });
    },
    [route, only]
  );

  function set<K extends keyof Filters>(key: K, value: Filters[K], loadingKey?: string) {
    const next = { ...filters, [key]: value };
    setFilters(next);
    apply(next, loadingKey ?? String(key));
  }

  function reset(keys?: string[]) {
    const next = keys
      ? Object.fromEntries(Object.entries(filters).map(([k, v]) => [k, keys.includes(k) ? undefined : v]))
      : {};
    setFilters(next);
    apply(next);
  }

  function isLoading(key: string) {
    return !!loading[key];
  }

  function isActive(key: string) {
    return filters[key] !== undefined && filters[key] !== '' && filters[key] !== false && filters[key] !== null;
  }

  return { filters, set, reset, isLoading, isActive };
}