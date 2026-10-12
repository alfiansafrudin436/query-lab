import type { MetadataRoute } from 'next'
import { getAllQueries, getCategoriesWithCount } from '@/lib/content'
import { SITE_URL } from '@/lib/site'

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const [queries, categories] = await Promise.all([getAllQueries(), getCategoriesWithCount()])

  return [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    ...['/queries', '/categories', '/schema'].map((path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...categories
      .filter((category) => category.count > 0)
      .map((category) => ({
        url: `${SITE_URL}/categories/${category.slug}`,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
    ...queries.map((query) => ({
      url: `${SITE_URL}/queries/${query.slug}`,
      lastModified: query.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
  ]
}

export default sitemap
