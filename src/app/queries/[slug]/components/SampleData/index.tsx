import { ArrowRightIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { QuerySample, SampleTable } from '@/types'

type SampleDataProps = {
  sample: QuerySample
}

export const SampleData = ({ sample }: SampleDataProps) => {
  const hasHighlight = [...sample.input, sample.output].some((table) => table.highlight.length > 0)

  return (
    <div className="flex flex-col gap-3">
      {sample.description && (
        <p className="text-[14.5px] leading-relaxed text-muted-foreground">{sample.description}</p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        {sample.input.length > 0 && (
          <>
            <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-3">
              {sample.input.map((table) => (
                <SampleTableView key={table.caption} table={table} />
              ))}
            </div>
            <ArrowRightIcon
              className="mx-auto size-[22px] shrink-0 rotate-90 text-subtle-foreground md:rotate-0"
              aria-hidden
            />
          </>
        )}
        <div className="flex min-w-0 flex-[1_1_300px] flex-col">
          <SampleTableView table={sample.output} />
        </div>
      </div>
      {hasHighlight && sample.highlightNote && (
        <p className="inline-flex items-center gap-2 text-[13px] text-muted-foreground">
          <span
            aria-hidden
            className="inline-block size-3.5 rounded-[3px] border border-warning-border bg-changed-soft"
          />
          {sample.highlightNote}
        </p>
      )}
    </div>
  )
}

const SampleTableView = ({ table }: { table: SampleTable }) => {
  const highlighted = new Set(table.highlight.map(([row, column]) => `${row}:${column}`))
  // Kolom berisi angka (atau NULL) rata kanan, termasuk header-nya.
  const numericColumns = new Set(
    table.columns
      .map((_, columnIndex) => columnIndex)
      .filter((columnIndex) =>
        table.rows.every(
          (row) => typeof row[columnIndex] === 'number' || row[columnIndex] === null,
        ),
      )
      .filter((columnIndex) => table.rows.some((row) => typeof row[columnIndex] === 'number')),
  )

  return (
    <div
      className="overflow-x-auto rounded-[10px] border bg-card"
      tabIndex={0}
      role="region"
      aria-label={table.caption}
    >
      <table className="w-full border-collapse font-mono text-[13px]">
        <caption className="border-b px-3.5 py-2.5 text-left font-sans text-[13.5px] font-semibold">
          {table.caption}
        </caption>
        <thead>
          <tr className="bg-background">
            {table.columns.map((column, columnIndex) => (
              <th
                key={column}
                scope="col"
                className={cn(
                  'px-3 py-2 text-left font-semibold whitespace-nowrap text-muted-foreground',
                  numericColumns.has(columnIndex) && 'text-right',
                )}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-border/70">
              {row.map((cell, columnIndex) => {
                const isHighlighted = highlighted.has(`${rowIndex}:${columnIndex}`)
                return (
                  <td
                    key={columnIndex}
                    className={cn(
                      'px-3 py-2 whitespace-nowrap',
                      numericColumns.has(columnIndex) && 'text-right',
                      isHighlighted && 'bg-changed-soft font-semibold text-changed-foreground',
                      cell === null && !isHighlighted && 'text-subtle-foreground italic',
                    )}
                  >
                    {cell === null ? 'NULL' : cell}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
