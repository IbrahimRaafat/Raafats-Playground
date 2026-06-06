import type { Meta, StoryObj } from '@storybook/react'

function Swatch({ name, variable }: { name: string; variable: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="h-12 w-full rounded-lg border border-border"
        style={{ background: `var(${variable})` }}
      />
      <p className="text-xs font-medium">{name}</p>
      <p className="text-xs text-muted-foreground font-mono">{variable}</p>
    </div>
  )
}

function TokenGrid({ title, tokens }: { title: string; tokens: { name: string; variable: string }[] }) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {tokens.map((t) => <Swatch key={t.variable} {...t} />)}
      </div>
    </div>
  )
}

function DesignTokensDocs() {
  return (
    <div className="space-y-10 p-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold mb-2">Design Tokens</h1>
        <p className="text-muted-foreground text-sm">Semantic CSS custom properties for the TS Playground design system.</p>
      </div>

      <TokenGrid title="Backgrounds" tokens={[
        { name: 'Background', variable: '--background' },
        { name: 'Card', variable: '--card' },
        { name: 'Muted', variable: '--muted' },
        { name: 'Accent', variable: '--accent' },
      ]} />

      <TokenGrid title="Brand" tokens={[
        { name: 'Primary', variable: '--primary' },
        { name: 'Primary Foreground', variable: '--primary-foreground' },
        { name: 'Secondary', variable: '--secondary' },
        { name: 'Secondary Foreground', variable: '--secondary-foreground' },
      ]} />

      <TokenGrid title="Text" tokens={[
        { name: 'Foreground', variable: '--foreground' },
        { name: 'Muted Foreground', variable: '--muted-foreground' },
        { name: 'Card Foreground', variable: '--card-foreground' },
        { name: 'Destructive', variable: '--destructive' },
      ]} />

      <TokenGrid title="Borders" tokens={[
        { name: 'Border', variable: '--border' },
        { name: 'Input', variable: '--input' },
        { name: 'Ring', variable: '--ring' },
      ]} />

      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Typography</h2>
        <div className="space-y-4">
          {[
            { label: 'Heading XL', cls: 'text-4xl font-bold' },
            { label: 'Heading L', cls: 'text-3xl font-bold' },
            { label: 'Heading M', cls: 'text-2xl font-semibold' },
            { label: 'Heading S', cls: 'text-xl font-semibold' },
            { label: 'Body', cls: 'text-base' },
            { label: 'Small', cls: 'text-sm' },
            { label: 'XSmall', cls: 'text-xs' },
          ].map(({ label, cls }) => (
            <div key={label} className="flex items-center gap-6">
              <span className="text-xs text-muted-foreground w-24 shrink-0">{label}</span>
              <span className={cls}>The quick brown fox</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Border Radius</h2>
        <div className="flex items-end gap-6">
          {[
            { label: 'sm', cls: 'rounded-sm' },
            { label: 'md', cls: 'rounded-md' },
            { label: 'lg', cls: 'rounded-lg' },
            { label: 'xl', cls: 'rounded-xl' },
            { label: '2xl', cls: 'rounded-2xl' },
            { label: 'full', cls: 'rounded-full' },
          ].map(({ label, cls }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 bg-primary ${cls}`} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const meta: Meta<typeof DesignTokensDocs> = {
  title: 'Design System/Tokens',
  component: DesignTokensDocs,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof DesignTokensDocs>
export const Tokens: Story = {}
