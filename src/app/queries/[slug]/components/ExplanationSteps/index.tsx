'use client'

import { cn } from '@/lib/utils'
import type { ExplanationStep } from '@/types'

type ExplanationStepsProps = {
  steps: ExplanationStep[]
  activeStep: number | null
  onToggle: (index: number) => void
}

const lineLabel = ([from, to]: ExplanationStep['lines']) => {
  return from === to ? `baris ${from}` : `baris ${from}–${to}`
}

export const ExplanationSteps = ({ steps, activeStep, onToggle }: ExplanationStepsProps) => {
  return (
    <ol className="flex flex-col gap-2">
      {steps.map((step, index) => {
        const active = index === activeStep
        return (
          <li key={`${step.clause}-${index}`}>
            <button
              type="button"
              onClick={() => onToggle(index)}
              aria-pressed={active}
              className={cn(
                'flex w-full cursor-pointer gap-3.5 rounded-[10px] border px-4 py-3.5 text-left transition-colors',
                active ? 'border-primary bg-primary-soft' : 'bg-card hover:border-input',
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'inline-flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-[13px] font-semibold',
                  active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                )}
              >
                {index + 1}
              </span>
              <span className="flex min-w-0 flex-col gap-1.5">
                <span className="flex flex-wrap items-baseline gap-2">
                  <code className="rounded-[5px] bg-muted px-1.5 py-0.5 font-mono text-[13.5px] font-semibold break-all text-foreground">
                    {step.clause}
                  </code>
                  <span className="text-[12.5px] text-subtle-foreground">
                    {lineLabel(step.lines)}
                  </span>
                </span>
                <span className="text-[15px] leading-relaxed text-foreground/90">{step.text}</span>
              </span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
