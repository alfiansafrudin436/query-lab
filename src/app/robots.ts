import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

const robots = (): MetadataRoute.Robots => {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/favorites' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}

export default robots
