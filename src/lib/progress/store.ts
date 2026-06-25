'use client'

import { createClient } from '@/lib/supabase/client'

const STORAGE_KEY = 'ts-playground-progress'

type ProgressStatus = 'completed' | 'in-progress'
type ProgressStore = Record<string, ProgressStatus>

// --- localStorage helpers ---

function readLocal(): ProgressStore {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function writeLocal(store: ProgressStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

// --- Supabase helpers ---

async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

async function dbGetAll(userId: string): Promise<ProgressStore> {
  const supabase = createClient()
  const { data } = await supabase
    .from('user_progress')
    .select('lesson_id, status')
    .eq('user_id', userId)
  if (!data) return {}
  return Object.fromEntries(data.map(r => [r.lesson_id, r.status as ProgressStatus]))
}

async function dbUpsert(userId: string, lessonId: string, status: ProgressStatus): Promise<void> {
  const supabase = createClient()
  await supabase.from('user_progress').upsert({
    user_id: userId,
    lesson_id: lessonId,
    status,
    completed_at: status === 'completed' ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,lesson_id' })
}

// --- Merge localStorage into Supabase on sign-in ---

export async function mergeLocalProgressToCloud(userId: string): Promise<void> {
  const local = readLocal()
  const entries = Object.entries(local)
  if (entries.length === 0) return

  const supabase = createClient()
  const rows = entries.map(([lessonId, status]) => ({
    user_id: userId,
    lesson_id: lessonId,
    status,
    completed_at: status === 'completed' ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  }))

  // Insert only rows that don't already exist in the DB (ignore conflicts)
  await supabase.from('user_progress').upsert(rows, {
    onConflict: 'user_id,lesson_id',
    ignoreDuplicates: true,
  })
}

// --- Public API ---

export async function markComplete(lessonId: string): Promise<void> {
  const userId = await getCurrentUserId()
  if (userId) {
    await dbUpsert(userId, lessonId, 'completed')
  } else {
    const store = readLocal()
    store[lessonId] = 'completed'
    writeLocal(store)
  }
}

export async function markInProgress(lessonId: string): Promise<void> {
  const userId = await getCurrentUserId()
  if (userId) {
    // Only upsert if not already completed
    const supabase = createClient()
    const { data } = await supabase
      .from('user_progress')
      .select('status')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .maybeSingle()
    if (data?.status !== 'completed') {
      await dbUpsert(userId, lessonId, 'in-progress')
    }
  } else {
    const store = readLocal()
    if (store[lessonId] !== 'completed') {
      store[lessonId] = 'in-progress'
      writeLocal(store)
    }
  }
}

export async function getProgress(lessonId: string): Promise<ProgressStatus | null> {
  const userId = await getCurrentUserId()
  if (userId) {
    const all = await dbGetAll(userId)
    return all[lessonId] ?? null
  }
  return readLocal()[lessonId] ?? null
}

export async function getAllProgress(): Promise<ProgressStore> {
  const userId = await getCurrentUserId()
  if (userId) return dbGetAll(userId)
  return readLocal()
}
