'use client'

import { useState } from 'react'
import type { DbQuestion } from '@/lib/supabase/client'
import type { PlaygroundConfig } from '@/lib/content/types'
import { supabase } from '@/lib/supabase/client'
import { Pencil, Trash2, Plus, Save, X, ExternalLink } from 'lucide-react'

type Props = {
  problems: DbQuestion[]
}

const EMPTY_CONFIG: PlaygroundConfig = {
  showPreview: false,
  showConsole: true,
  showTests: true,
  testCodeVisible: true,
  autorun: false,
}

function ProblemForm({
  problem,
  onSave,
  onCancel,
}: {
  problem?: DbQuestion
  onSave: () => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(problem?.title ?? '')
  const [description, setDescription] = useState(problem?.description ?? '')
  const [type, setType] = useState<'coding' | 'theory'>(problem?.type ?? 'coding')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(problem?.difficulty ?? 'easy')
  const [topic, setTopic] = useState(problem?.topic ?? '')
  const [companies, setCompanies] = useState(problem?.companies?.join(', ') ?? '')
  const [answer, setAnswer] = useState(problem?.answer ?? '')
  const [hint, setHint] = useState(problem?.hint ?? '')
  const [starterCode, setStarterCode] = useState(problem?.starter_code ?? '')
  const [isPremium, setIsPremium] = useState(problem?.is_premium ?? false)

  const config = (problem?.playground_config as PlaygroundConfig) ?? EMPTY_CONFIG
  const [showPreview, setShowPreview] = useState(config.showPreview ?? false)
  const [showConsole, setShowConsole] = useState(config.showConsole ?? true)
  const [showTests, setShowTests] = useState(config.showTests ?? true)
  const [testCodeVisible, setTestCodeVisible] = useState(config.testCodeVisible ?? true)
  const [autorun, setAutorun] = useState(config.autorun ?? false)

  const [starterFiles, setStarterFiles] = useState(
    JSON.stringify(config.starterFiles ?? { '/index.ts': starterCode || '// Write your solution here\n' }, null, 2)
  )
  const [solutionFiles, setSolutionFiles] = useState(
    JSON.stringify(config.solutionFiles ?? {}, null, 2)
  )
  const [testFile, setTestFile] = useState(config.testFile ?? '')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)

    const playground_config: PlaygroundConfig = {
      showPreview,
      showConsole,
      showTests,
      testCodeVisible,
      autorun,
      starterFiles: JSON.parse(starterFiles),
      solutionFiles: JSON.parse(solutionFiles),
      testFile: testFile || undefined,
    }

    const row = {
      title,
      description,
      type,
      difficulty,
      topic: topic || null,
      companies: companies.split(',').map((c) => c.trim()).filter(Boolean),
      answer: answer || null,
      hint: hint || null,
      starter_code: starterCode || null,
      is_premium: isPremium,
      playground_config,
    }

    if (problem) {
      await supabase.from('questions').update(row).eq('id', problem.id)
    } else {
      await supabase.from('questions').insert({ ...row, source: 'manual' })
    }

    setSaving(false)
    onSave()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-8">
      <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-4xl my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold">{problem ? 'Edit Problem' : 'New Problem'}</h2>
          <button onClick={onCancel} className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Basic info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as typeof type)} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background">
                <option value="coding">Coding</option>
                <option value="theory">Theory</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as typeof difficulty)} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Topic</label>
              <input value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background" placeholder="e.g. JavaScript" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Companies (comma-separated)</label>
              <input value={companies} onChange={(e) => setCompanies(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background" placeholder="Google, Meta" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Hint</label>
              <input value={hint} onChange={(e) => setHint(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Answer (theory only)</label>
              <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={3} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background resize-none" />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input type="checkbox" id="premium" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} className="rounded" />
              <label htmlFor="premium" className="text-sm">Premium (requires auth)</label>
            </div>
          </div>

          {/* Playground config */}
          <div className="border-t border-border pt-6">
            <h3 className="text-sm font-semibold mb-4">Playground Configuration</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="showPreview" checked={showPreview} onChange={(e) => setShowPreview(e.target.checked)} className="rounded" />
                <label htmlFor="showPreview" className="text-sm">Show Preview</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="showConsole" checked={showConsole} onChange={(e) => setShowConsole(e.target.checked)} className="rounded" />
                <label htmlFor="showConsole" className="text-sm">Show Console</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="showTests" checked={showTests} onChange={(e) => setShowTests(e.target.checked)} className="rounded" />
                <label htmlFor="showTests" className="text-sm">Show Tests</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="testCodeVisible" checked={testCodeVisible} onChange={(e) => setTestCodeVisible(e.target.checked)} className="rounded" />
                <label htmlFor="testCodeVisible" className="text-sm">Test Code Visible</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="autorun" checked={autorun} onChange={(e) => setAutorun(e.target.checked)} className="rounded" />
                <label htmlFor="autorun" className="text-sm">Auto-run on edit</label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Starter Files (JSON)</label>
                <textarea value={starterFiles} onChange={(e) => setStarterFiles(e.target.value)} rows={6} className="w-full px-3 py-2 text-xs font-mono border border-border rounded-md bg-background resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Solution Files (JSON)</label>
                <textarea value={solutionFiles} onChange={(e) => setSolutionFiles(e.target.value)} rows={6} className="w-full px-3 py-2 text-xs font-mono border border-border rounded-md bg-background resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Test File</label>
                <textarea value={testFile} onChange={(e) => setTestFile(e.target.value)} rows={8} className="w-full px-3 py-2 text-xs font-mono border border-border rounded-md bg-background resize-none" placeholder="// JavaScript test code" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !title}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function AdminProblemsList({ problems }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  function handleSave() {
    setEditingId(null)
    setShowNew(false)
    setRefreshKey((k) => k + 1)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this problem?')) return
    await supabase.from('questions').delete().eq('id', id)
    setRefreshKey((k) => k + 1)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Problems</h1>
          <p className="text-sm text-muted-foreground mt-1">{problems.length} problems total</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Problem
        </button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Title</th>
              <th className="text-left px-4 py-3 font-medium">Type</th>
              <th className="text-left px-4 py-3 font-medium">Difficulty</th>
              <th className="text-left px-4 py-3 font-medium">Topic</th>
              <th className="text-left px-4 py-3 font-medium">Playground</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((p) => (
              <tr key={p.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-xs">{p.description}</div>
                </td>
                <td className="px-4 py-3 text-xs capitalize">{p.type}</td>
                <td className="px-4 py-3 text-xs capitalize">{p.difficulty}</td>
                <td className="px-4 py-3 text-xs">{p.topic ?? '-'}</td>
                <td className="px-4 py-3">
                  {p.playground_config ? (
                    <span className="text-xs text-green-600 dark:text-green-400">Configured</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Default</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {p.playground_config && (
                      <a
                        href={`/problems/${p.id}`}
                        target="_blank"
                        className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => setEditingId(p.id)}
                      className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 text-muted-foreground hover:text-red-500 rounded-md hover:bg-muted/50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(showNew || editingId) && (
        <ProblemForm
          problem={editingId ? problems.find((p) => p.id === editingId) : undefined}
          onSave={handleSave}
          onCancel={() => { setEditingId(null); setShowNew(false) }}
        />
      )}
    </div>
  )
}
