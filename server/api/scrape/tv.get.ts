import scrapers from '../../scrapers'

export default defineEventHandler(async (event) => {
  const { url, language } = getQuery(event)

  const { hostname } = new URL(url)

  let source
  if (hostname.includes('iq.com') || hostname.includes('iqiyi')) {
    source = 'iqiyi'
  } else if (hostname.includes('youku')) {
    source = 'youku'
  } else if (hostname.includes('wetv')) {
    source = 'wetv'
  } else if (hostname.includes('netflix')) {
    source = 'netflix'
  }

  if (!source) {
    throw createError(
      'This streaming service is not currently supported. Please use another link.',
    )
  }

  return scrapers[source].tv(url, language)
})
