'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useFetch<T>(url: string) {
  return useSWR<T>(url, fetcher);
}
