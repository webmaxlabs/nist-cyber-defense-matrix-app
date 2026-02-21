import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://cyberdefensematrix.ai'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/projects', '/project/', '/api/', '/auth/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
