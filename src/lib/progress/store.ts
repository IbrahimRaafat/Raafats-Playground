'use client'

const STORAGE_KEY = 'ts-playground-progress'

type ProgressStatus = 'completed' | 'in-progress'
type ProgressStore = Record<string, ProgressStatus>

function readStore(): ProgressStore {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function writeStore(store: ProgressStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function markComplete(lessonId: string): void {
  const store = readStore()
  store[lessonId] = 'completed'
  writeStore(store)
}

export function markInProgress(lessonId: string): void {
  const store = readStore()
  if (store[lessonId] !== 'completed') {
    store[lessonId] = 'in-progress'
    writeStore(store)
  }
}

export function getProgress(lessonId: string): ProgressStatus | null {
  return readStore()[lessonId] ?? null
}

export function getAllProgress(): ProgressStore {
  return readStore()
}
