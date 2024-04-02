import { getStreamingService } from '~/utils'
import scrapers from '../../scrapers'

export default defineEventHandler(async (event) => {
  const { url, language } = getQuery(event)

  const service = getStreamingService(url)

  if (!service) {
    throw createError(
      'This streaming service is not currently supported. Please use another link.',
    )
  }

  return scrapers[service].tv(url, language)
})
