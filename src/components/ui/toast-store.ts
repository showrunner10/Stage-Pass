'use client';

export type ToastTone = 'success' | 'error' | 'info';

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
};

type Subscriber = (items: ToastItem[]) => void;

let items: ToastItem[] = [];
const subscribers = new Set<Subscriber>();

function publish() {
  subscribers.forEach((subscriber) => subscriber(items));
}

export function subscribeToToasts(subscriber: Subscriber) {
  subscribers.add(subscriber);
  subscriber(items);
  return () => {
    subscribers.delete(subscriber);
  };
}

export function dismissToast(id: string) {
  items = items.filter((item) => item.id !== id);
  publish();
}

export function pushToast(input: Omit<ToastItem, 'id'>) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const next: ToastItem = { id, ...input };
  items = [...items, next];
  publish();

  window.setTimeout(() => {
    dismissToast(id);
  }, 4200);
}

export const toast = {
  success(title: string, description?: string) {
    pushToast({ tone: 'success', title, description });
  },
  error(title: string, description?: string) {
    pushToast({ tone: 'error', title, description });
  },
  info(title: string, description?: string) {
    pushToast({ tone: 'info', title, description });
  },
};
