import fetcher from '../lib'

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
  }

  if (!source) {
    throw createError({
      message:
        'This streaming service is not currently supported. Please use another link.',
    })
  }

  return fetcher[source](url, language)
})
