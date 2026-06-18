'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { PlaygroundConfig } from '@/lib/content/types'
import { Pencil, Trash2, Plus, Save, X } from 'lucide-react'

type DbLesson = {
  id: string
  track_slug: string
  slug: string
  title: string
  description: string
  difficulty: string
  sort_order: number
  mdx_content: string
  sandpack_template: string
  starter_files: Record<string, string>
  solution_files: Record<string, string>
  test_file: string
  playground_config: PlaygroundConfig | null
}

type Props = {
  lessons: DbLesson[]
}

function LessonForm({
  lesson,
  onSave,
  onCancel,
}: {
  lesson?: DbLesson
  onSave: () => void
  onCancel: () => void
}) {
  const [trackSlug, setTrackSlug] = useState(lesson?.track_slug ?? 'javascript')
  const [slug, setSlug] = useState(lesson?.slug ?? '')
  const [title, setTitle] = useState(lesson?.title ?? '')
  const [description, setDescription] = useState(lesson?.description ?? '')
  const [difficulty, setDifficulty] = useState(lesson?.difficulty ?? 'beginner')
  const [sortOrder, setSortOrder] = useState(lesson?.sort_order ?? 0)
  const [mdxContent, setMdxContent] = useState(lesson?.mdx_content ?? '')
  const [sandpackTemplate, setSandpackTemplate] = useState(lesson?.sandpack_template ?? 'vanilla-ts')
  const [starterFiles, setStarterFiles] = useState(
    JSON.stringify(lesson?.starter_files ?? { '/index.ts': '' }, null, 2)
  )
  const [solutionFiles, setSolutionFiles] = useState(
    JSON.stringify(lesson?.solution_files ?? {}, null, 2)
  )
  const [testFile, setTestFile] = useState(lesson?.test_file ?? '')

  const config = (lesson?.playground_config as PlaygroundConfig) ?? {}
  const [showPreview, setShowPreview] = useState(config.showPreview ?? false)
  const [showConsole, setShowConsole] = useState(config.showConsole ?? true)
  const [showTests, setShowTests] = useState(config.showTests ?? true)
  const [testCodeVisible, setTestCodeVisible] = useState(config.testCodeVisible ?? true)
  const [autorun, setAutorun] = useState(config.autorun ?? false)

  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)

    const playground_config: PlaygroundConfig = {
      showPreview,
      showConsole,
      showTests,
      testCodeVisible,
      autorun,
    }

    const row = {
      track_slug: trackSlug,
      slug,
      title,
      description,
      difficulty,
      sort_order: sortOrder,
      mdx_content: mdxContent,
      sandpack_template: sandpackTemplate,
      starter_files: JSON.parse(starterFiles),
      solution_files: JSON.parse(solutionFiles),
      test_file: testFile,
      playground_config,
    }

    if (lesson) {
      await supabase.from('lessons').update(row).eq('id', lesson.id)
    } else {
      await supabase.from('lessons').insert(row)
    }

    setSaving(false)
    onSave()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-8">
      <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-4xl my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold">{lesson ? 'Edit Lesson' : 'New Lesson'}</h2>
          <button onClick={onCancel} className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Basic info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Track</label>
              <select value={trackSlug} onChange={(e) => setTrackSlug(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background">
                <option value="javascript">JavaScript</option>
                <option value="react">React</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Slug</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background" placeholder="01-variables" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Order</label>
              <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Template</label>
              <select value={sandpackTemplate} onChange={(e) => setSandpackTemplate(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background">
                <option value="vanilla-ts">Vanilla TS</option>
                <option value="react-ts">React TS</option>
              </select>
            </div>
          </div>

          {/* MDX Content */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">MDX Content</label>
            <textarea value={mdxContent} onChange={(e) => setMdxContent(e.target.value)} rows={10} className="w-full px-3 py-2 text-xs font-mono border border-border rounded-md bg-background resize-none" />
          </div>

          {/* Code files */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Starter Files (JSON)</label>
              <textarea value={starterFiles} onChange={(e) => setStarterFiles(e.target.value)} rows={8} className="w-full px-3 py-2 text-xs font-mono border border-border rounded-md bg-background resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Solution Files (JSON)</label>
              <textarea value={solutionFiles} onChange={(e) => setSolutionFiles(e.target.value)} rows={8} className="w-full px-3 py-2 text-xs font-mono border border-border rounded-md bg-background resize-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Test File</label>
            <textarea value={testFile} onChange={(e) => setTestFile(e.target.value)} rows={10} className="w-full px-3 py-2 text-xs font-mono border border-border rounded-md bg-background resize-none" />
          </div>

          {/* Playground config */}
          <div className="border-t border-border pt-6">
            <h3 className="text-sm font-semibold mb-4">Playground Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
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
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !title || !slug}
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

export function AdminLessonsList({ lessons }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  function handleSave() {
    setEditingId(null)
    setShowNew(false)
    setRefreshKey((k) => k + 1)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this lesson?')) return
    await supabase.from('lessons').delete().eq('id', id)
    setRefreshKey((k) => k + 1)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Lessons</h1>
          <p className="text-sm text-muted-foreground mt-1">{lessons.length} lessons total</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Lesson
        </button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Title</th>
              <th className="text-left px-4 py-3 font-medium">Track</th>
              <th className="text-left px-4 py-3 font-medium">Difficulty</th>
              <th className="text-left px-4 py-3 font-medium">Order</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((l) => (
              <tr key={l.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="font-medium">{l.title}</div>
                  <div className="text-xs text-muted-foreground">{l.slug}</div>
                </td>
                <td className="px-4 py-3 text-xs capitalize">{l.track_slug}</td>
                <td className="px-4 py-3 text-xs capitalize">{l.difficulty}</td>
                <td className="px-4 py-3 text-xs">{l.sort_order}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => setEditingId(l.id)}
                      className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(l.id)}
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
        <LessonForm
          lesson={editingId ? lessons.find((l) => l.id === editingId) : undefined}
          onSave={handleSave}
          onCancel={() => { setEditingId(null); setShowNew(false) }}
        />
      )}
    </div>
  )
}
