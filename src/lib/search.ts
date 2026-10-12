import MiniSearch from 'minisearch'
import type { QuerySummary } from '@/types'

type SearchDocument = {
  id: string
  title: string
  summary: string
  tags: string
  code: string
}

export type SearchIndex = MiniSearch<SearchDocument>

export const createSearchIndex = (items: QuerySummary[]): SearchIndex => {
  const index = new MiniSearch<SearchDocument>({
    fields: ['title', 'tags', 'summary', 'code'],
    searchOptions: {
      boost: { title: 4, tags: 3, summary: 2, code: 1 },
      prefix: true,
      fuzzy: 0.2,
      combineWith: 'AND',
    },
  })
  index.addAll(
    items.map((item) => ({
      id: item.slug,
      title: item.title,
      summary: item.summary,
      tags: item.tags.join(' '),
      code: item.variants.map((variant) => variant.code).join('\n'),
    })),
  )
  return index
}

// Mengembalikan slug yang cocok, urut dari yang paling relevan.
export const searchQueries = (index: SearchIndex, query: string): string[] => {
  const trimmed = query.trim()
  if (!trimmed) return []
  return index.search(trimmed).map((result) => String(result.id))
}

export const searchTerms = (query: string): string[] => {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length >= 2)
}

export type TextSegment = {
  text: string
  match: boolean
}

export const highlightSegments = (text: string, terms: string[]): TextSegment[] => {
  if (!terms.length) return [{ text, match: false }]
  const lower = text.toLowerCase()
  const marks = new Array<boolean>(text.length).fill(false)
  for (const term of terms) {
    let index = lower.indexOf(term)
    while (index >= 0) {
      marks.fill(true, index, index + term.length)
      index = lower.indexOf(term, index + term.length)
    }
  }

  const segments: TextSegment[] = []
  for (let i = 0; i < text.length; i++) {
    const last = segments.at(-1)
    if (last && last.match === marks[i]) {
      last.text += text[i]
    } else {
      segments.push({ text: text[i], match: marks[i] })
    }
  }
  return segments
}
