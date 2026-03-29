"use client";

import { Deal } from "@/lib/types";

const FAVORITE_DEALS_KEY = "hyperlocal-favorite-deals";
const FAVORITE_STORES_KEY = "hyperlocal-favorite-stores";
const SAVED_FILTERS_KEY = "hyperlocal-saved-filters";
const RECENT_VIEWS_KEY = "hyperlocal-recent-views";
const SEARCH_HISTORY_KEY = "hyperlocal-search-history";
const SAVED_LOCATIONS_KEY = "hyperlocal-saved-locations";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }
  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getFavoriteDealIds(): number[] {
  return readJson<number[]>(FAVORITE_DEALS_KEY, []);
}

export function toggleFavoriteDeal(id: number): number[] {
  const ids = new Set(getFavoriteDealIds());
  if (ids.has(id)) {
    ids.delete(id);
  } else {
    ids.add(id);
  }
  const next = [...ids];
  writeJson(FAVORITE_DEALS_KEY, next);
  return next;
}

export function getFavoriteStores(): string[] {
  return readJson<string[]>(FAVORITE_STORES_KEY, []);
}

export function toggleFavoriteStore(name: string): string[] {
  const stores = new Set(getFavoriteStores());
  if (stores.has(name)) {
    stores.delete(name);
  } else {
    stores.add(name);
  }
  const next = [...stores];
  writeJson(FAVORITE_STORES_KEY, next);
  return next;
}

export function getSavedFilters<T>(): T[] {
  return readJson<T[]>(SAVED_FILTERS_KEY, []);
}

export function saveFilterPreset<T>(preset: T): T[] {
  const presets = getSavedFilters<T>();
  const next = [preset, ...presets].slice(0, 5);
  writeJson(SAVED_FILTERS_KEY, next);
  return next;
}

export function getRecentViews(): Deal[] {
  return readJson<Deal[]>(RECENT_VIEWS_KEY, []);
}

export function addRecentView(deal: Deal): Deal[] {
  const current = getRecentViews().filter((item) => item.id !== deal.id);
  const next = [deal, ...current].slice(0, 6);
  writeJson(RECENT_VIEWS_KEY, next);
  return next;
}

export function getSearchHistory(): string[] {
  return readJson<string[]>(SEARCH_HISTORY_KEY, []);
}

export function addSearchHistory(value: string): string[] {
  const query = value.trim();
  if (!query) {
    return getSearchHistory();
  }
  const next = [query, ...getSearchHistory().filter((item) => item !== query)].slice(0, 8);
  writeJson(SEARCH_HISTORY_KEY, next);
  return next;
}

export type SavedLocation = {
  label: string;
  latitude: number;
  longitude: number;
};

export function getSavedLocations(): SavedLocation[] {
  return readJson<SavedLocation[]>(SAVED_LOCATIONS_KEY, []);
}

export function saveLocation(location: SavedLocation): SavedLocation[] {
  const next = [location, ...getSavedLocations().filter((item) => item.label !== location.label)].slice(0, 5);
  writeJson(SAVED_LOCATIONS_KEY, next);
  return next;
}
